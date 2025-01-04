import PaymentForm from "@/app/components/Financials/PaymentForm";
import React from "react";
import { Container } from "react-bootstrap";

const Deposits = () => {
  return (
    <Container fluid className="px-0" style={{ marginBottom: "100px" }}>
      <PaymentForm />
    </Container>
  );
};

export default Deposits;
