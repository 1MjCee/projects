import React from "react";
import { Navbar, Nav, Row, Col, Container } from "react-bootstrap";
import { PiHandDeposit } from "react-icons/pi";
import { GiWantedReward } from "react-icons/gi";
import Link from "next/link";

const ActionNavbar = () => {
  return (
    <Navbar>
      <Nav
        className="justify-content-between p-2"
        style={{
          width: "100%",
          display: "flex",
          backgroundColor: "#03002e",
          borderRadius: "8px",
          border: "1px solid #DA9100",
        }}
      >
        {[
          {
            to: "/dashboard/account/user/financials/deposits",
            icon: <PiHandDeposit size={20} color="#FF8C00" />,
            text: "Recharge",
          },
          {
            to: "/dashboard/account/user/financials/withdrawals",
            icon: <GiWantedReward size={20} color="#FF8C00" />,
            text: "Withdraw",
          },
        ].map(({ to, icon, text }) => (
          <Link
            as={Link}
            href={to}
            passHref
            key={text}
            className="text-center"
            style={{
              flex: "1",
              margin: "auto 3px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="text-success">{icon}</div>
              <div style={{ fontWeight: "bold" }} className="text-light">
                {text}
              </div>
            </div>
          </Link>
        ))}
      </Nav>
    </Navbar>
  );
};

export default ActionNavbar;
