import React from "react";
import { Spinner, Container, Row, Col } from "react-bootstrap";

const CenteredSpinner = () => {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row>
        <Col className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </Col>
      </Row>
    </Container>
  );
};

export default CenteredSpinner;
