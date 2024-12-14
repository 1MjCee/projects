import { Container } from "react-bootstrap";

const SubHeader = ({ title }) => {
  return (
    <Container className="d-flex justify-content-center align-items-center my-3">
      <h3 className="text-center" style={{ color: "#FF8C00" }}>
        {title}
      </h3>
    </Container>
  );
};

export default SubHeader;
