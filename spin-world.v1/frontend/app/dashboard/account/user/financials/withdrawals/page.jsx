import React from "react";
import { Container } from "react-bootstrap";
import Withdraw from "@/app/components/Financials/Withdraw";

const Withdrawals = () => {
  return (
    <Container fluid className="px-0" style={{ marginBottom: "100px" }}>
      <Withdraw />
    </Container>
  );
};

export default Withdrawals;
