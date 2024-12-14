import React from "react";
import UserLogin from "../components/Forms/LoginForm";
import { Container } from "react-bootstrap";

const Login = () => {
  return (
    <Container fluid style={{ backgroundColor: "#010048" }}>
      <UserLogin />
    </Container>
  );
};

export default Login;
