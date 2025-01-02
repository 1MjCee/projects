import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { Container } from "react-bootstrap";
import NavigationBar from "./Navbar";
import TawkToWidget from "./TalkToWidget";

const ProtectedLayout = () => {
  const marginBottom = "100px";

  return (
    <Container style={{ backgroundColor: "#010048" }} fluid className="p-0">
      <main className="container-fluid" style={{ marginBottom }}>
        <Outlet />
      </main>
      <TawkToWidget />
      <Footer />
    </Container>
  );
};

export default ProtectedLayout;
