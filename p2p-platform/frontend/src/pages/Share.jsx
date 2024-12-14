import React from "react";
import Stats from "../components/Share/Stats";
import PromotionDetails from "../components/Share/PromotionDetails";
import InviteCode from "../components/Share/InviteCode";
import { Container } from "react-bootstrap";
import ReferralList from "../components/Share/ReferralList";

const Share = () => {
  return (
    <Container
      className="px-0"
      fluid
      style={{
        minHeight: "100vh",
      }}
    >
      <Stats />
      <InviteCode />
      <ReferralList />
    </Container>
  );
};

export default Share;
