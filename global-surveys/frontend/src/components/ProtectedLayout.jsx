import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { Container } from "react-bootstrap";
import NavigationBar from "./Navbar";
import TawkToWidget from "./TalkToUs";

const ProtectedLayout = () => {
  const marginBottom = "100px";
  const location = useLocation();

  // Define routes where the navbar should be visible
  const showNavbar = [
    // "/recharge",
    // "/bonus-tasks",
    // "/earnings",
    // "/notices",
    // "/successful-withdrawals",
    // "/account/user/inbox",
    // "/account/user/withdrawals",
    // "/account/user/deposits",
    // "/account/user/team",
    // "/about-us",
    // "/account/user/withdrawal-details",
    // "/account/user/profile/info",
    // "/account/user/profile/update-password",
    // "/account/user/profile",
    // "/user/rewards",
  ].includes(location.pathname);

  return (
    <Container style={{ backgroundColor: "#010048" }} fluid className="p-0">
      {showNavbar && <NavigationBar />}
      <main className="container-fluid" style={{ marginBottom }}>
        <Outlet />
      </main>
      <TawkToWidget />
      <Footer />
    </Container>
  );
};

export default ProtectedLayout;
