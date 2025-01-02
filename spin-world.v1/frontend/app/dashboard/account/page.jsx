import React from "react";
import UserProfile from "@/app/components/Account/UserProfile";
import BalanceInfo from "@/app/components/Account/BalanceInfo";
import QuickLinks from "@/app/components/Account/QuickLinks";

const Account = () => {
  return (
    <div style={{ width: "100%", padding: 0, marginBottom: "100px" }}>
      <UserProfile />
      <BalanceInfo />
      <QuickLinks />
    </div>
  );
};

export default Account;
