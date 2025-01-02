"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "@/reduxStore/slices/AuthSlice";
import { getTokenFromLocalStorage } from "../utils/api";

function AuthWrapper({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const token = getTokenFromLocalStorage("access_token");
    const isOnAuthPage = ["/auth/login", "/", "/auth/register"].includes(
      pathname
    );

    if (token) {
      try {
        const user = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (user.exp >= currentTime) {
          dispatch(loginSuccess(user));
          if (isOnAuthPage) {
            const intendedPath =
              sessionStorage.getItem("intendedPath") || "/dashboard";
            sessionStorage.removeItem("intendedPath");
            router.push(intendedPath);
            return;
          }
        }
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }

    if (!isAuthenticated && !isOnAuthPage) {
      sessionStorage.setItem("intendedPath", pathname);
      router.push("/auth/login");
    }
  }, [dispatch, router, pathname, isAuthenticated]);

  return children;
}

export default AuthWrapper;
