import React from "react";
import UserProfile from "../components/Account/UserProfile";
import BalanceInfo from "../components/Account/BalanceInfo";
import QuickLinks from "../components/Account/QuickLinks";
import Financials from "../components/Account/Financials";

const Account = () => {
  return (
    <div style={{ width: "100%", padding: 0 }}>
      <UserProfile />
      <BalanceInfo />
      {/* <Financials /> */}
      <QuickLinks />
    </div>
  );
};

export default Account;
