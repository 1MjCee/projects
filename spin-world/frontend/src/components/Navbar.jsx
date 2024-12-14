import { Navbar, Container } from "react-bootstrap";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container
      style={{ borderBottom: "1px solid #004225" }}
      fluid
      className="px-0"
    >
      <Navbar className="px-0">
        <Navbar.Brand
          className="p-0"
          onClick={handleBack}
          style={{ cursor: "pointer", color: "#004225" }}
        >
          <IoArrowBack color="#004225" /> Go Back
        </Navbar.Brand>
      </Navbar>
    </Container>
  );
};

export default NavigationBar;
