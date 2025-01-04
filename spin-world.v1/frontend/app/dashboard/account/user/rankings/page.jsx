import UserRanking from "@/app/components/Rewards/Ranking";
import React from "react";
import { Container } from "react-bootstrap";

const Rankings = () => {
  return (
    <Container fluid className="px-0" style={{ marginBottom: "100px" }}>
      <UserRanking />
    </Container>
  );
};

export default Rankings;
