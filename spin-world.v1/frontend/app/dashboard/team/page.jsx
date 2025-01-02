import React from "react";
import Stats from "@/app/components/Share/Stats";
import InviteCode from "@/app/components/Share/InviteCode";
import { Container } from "react-bootstrap";
import ReferralList from "@/app/components/Share/ReferralList";

const Team = () => {
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

export default Team;
