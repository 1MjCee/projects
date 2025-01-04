import WithdrawalAccount from "@/app/components/Financials/WithdrawalDetails";
import React from "react";
import { Container } from "react-bootstrap";

const WithdrawalDetails = () => {
  return (
    <Container fluid className="px-0" style={{ marginBottom: "100px" }}>
      <WithdrawalAccount />
    </Container>
  );
};

export default WithdrawalDetails;
