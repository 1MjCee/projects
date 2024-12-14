import React from "react";
import { Navbar, Nav, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PiHandDeposit } from "react-icons/pi";
import { GiWantedReward } from "react-icons/gi";

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
            to: "/recharge",
            icon: <PiHandDeposit size={20} color="#FF8C00" />,
            text: "Recharge",
          },
          {
            to: "/withdraw",
            icon: <GiWantedReward size={20} color="#FF8C00" />,
            text: "Withdraw",
          },
        ].map(({ to, icon, text }) => (
          <Nav.Link
            as={Link}
            to={to}
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
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
};

export default ActionNavbar;
