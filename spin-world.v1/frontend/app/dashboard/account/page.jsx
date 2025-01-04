import React from "react";
import UserProfile from "@/app/components/Account/UserProfile";
import BalanceInfo from "@/app/components/Account/BalanceInfo";
import QuickLinks from "@/app/components/Account/QuickLinks";
import { Container } from "react-bootstrap";

const Account = () => {
  return (
    <Container
      fluid
      className="px-0"
      style={{ width: "100%", padding: 0, marginBottom: "100px" }}
    >
      <UserProfile />
      <BalanceInfo />
      <QuickLinks />
    </Container>
  );
};

export default Account;
