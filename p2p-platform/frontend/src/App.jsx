import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { getTokenFromLocalStorage } from "./apis/api";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "./store/slices/AuthSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import Share from "./pages/Share";
import Account from "./pages/Account";
import { useLocation } from "react-router-dom";
import Profile from "./components/Account/Profile/Profile";
import DigTreasure from "./components/Account/Rewards/Treasure";
import MyTeam from "./components/Account/Team/MyTeam";
import WithdrawalAccount from "./components/Financials/WithdrawalDetails";
import ProfileInfo from "./components/Account/Profile/ProfileDetails";
import ChangePassword from "./components/Account/Profile/UpdatePassword";
import TeamLevel from "./components/Account/Team/TeamLevel";
import { useSelector } from "react-redux";
import Withdraw from "./components/Financials/Withdraw";
import UserRanking from "./components/Rewards/Ranking";
import PaymentForm from "./components/Financials/PaymentForm";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Landing from "./pages/Landing";
import Reviews from "./pages/Reviews";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = getTokenFromLocalStorage("access");
    const isOnAuthPage =
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/";

    if (token) {
      try {
        const user = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Ensure the token has an 'exp' property and that it is not expired
        if (user?.exp && user.exp >= currentTime) {
          dispatch(loginSuccess(user));

          // Redirect if the user was on an authentication page
          if (isOnAuthPage) {
            const intendedPath =
              sessionStorage.getItem("intendedPath") || "/dashboard";
            sessionStorage.removeItem("intendedPath");
            navigate(intendedPath);
            return;
          }
        }
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }

    // If the user is not authenticated and not on an auth page, redirect to login
    if (!isAuthenticated && !isOnAuthPage) {
      sessionStorage.setItem("intendedPath", location.pathname);
      navigate("/");
    }
  }, [isAuthenticated, location.pathname, dispatch, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="share" element={<Share />} />
        <Route path="plans" element={<Plans />} />
        <Route path="account" element={<Account />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="account/user/ranking" element={<UserRanking />} />
        <Route path="account/user/profile" element={<Profile />} />
        <Route path="user/payment" element={<PaymentForm />} />
        <Route path="account/user/profile-update" element={<ProfileInfo />} />
        <Route
          path="account/user/profile/update-password"
          element={<ChangePassword />}
        />
        <Route
          path="account/user/withdrawal-details"
          element={<WithdrawalAccount />}
        />

        <Route path="redeem" element={<DigTreasure />} />
        <Route path="account/user/team" element={<MyTeam />} />
        <Route path="account/user/team/:level" element={<TeamLevel />} />
        <Route path="user/withdraw" element={<Withdraw />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default App;
