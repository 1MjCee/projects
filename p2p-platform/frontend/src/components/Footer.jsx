import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import { FaHome } from "react-icons/fa";
import { GiOpenTreasureChest } from "react-icons/gi";
import { FaShareFromSquare } from "react-icons/fa6";
import { MdSubscriptions } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        height: "80px",
        padding: "auto",
        margin: "auto",
        backgroundColor: "#03002e",
        zIndex: 1000,
      }}
    >
      <Container fluid className="mt-4">
        <Row className="justify-content-between text-center w-100">
          <Col xs={2} sm={2} md={2} className="foot_bo">
            <Link to="/dashboard">
              <FaHome color="#DA9100" size={30} className="footer-icon" />
              <p className="footer-text text-light d-sm-block">Home</p>
            </Link>
          </Col>
          <Col xs={2} sm={2} md={2} className="foot_bo">
            <Link to="redeem">
              <GiOpenTreasureChest
                color="#DA9100"
                size={30}
                className="footer-icon"
              />
              <p className="footer-text text-light d-sm-block">Redeem</p>
            </Link>
          </Col>
          <Col xs={2} sm={2} md={2} className="foot_bo">
            <Link to="plans">
              <MdSubscriptions
                color="#DA9100"
                size={30}
                className="footer-icon"
              />
              <p className="footer-text text-light d-sm-block">Plans</p>
            </Link>
          </Col>
          <Col xs={2} sm={2} md={2} className="foot_bo">
            <Link to="share">
              <FaShareFromSquare
                color="#DA9100"
                size={30}
                className="footer-icon"
              />
              <p className="footer-text text-light d-sm-block">Team</p>
            </Link>
          </Col>
          <Col xs={2} sm={2} md={2} className="foot_bo">
            <Link to="account">
              <IoMdSettings color="#DA9100" size={30} className="footer-icon" />
              <p className="footer-text text-light d-sm-block">Account</p>
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
