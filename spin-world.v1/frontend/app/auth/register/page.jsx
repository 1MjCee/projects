import UserRegister from "@/app/components/Forms/RegisterForm";
import React from "react";
import { Container } from "react-bootstrap";

const page = () => {
  return (
    <Container fluid className="px-0">
      <UserRegister />
    </Container>
  );
};

export default page;
