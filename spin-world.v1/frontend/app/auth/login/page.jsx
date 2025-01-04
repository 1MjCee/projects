import UserLogin from "@/app/components/Forms/LoginForm";
import React from "react";
import { Container } from "react-bootstrap";

const page = () => {
  return (
    <Container fluid className="px-0">
      <UserLogin />
    </Container>
  );
};

export default page;
