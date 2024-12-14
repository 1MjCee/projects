import React from "react";
import { Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavCardItem from "./NavCard";

const Navigation = () => {
  return (
    <Container fluid>
      <Row className="justify-content-center border-none">
        <NavCardItem
          to="/notices"
          imgSrc="/assets/icons/nav_ico1.png"
          altText="Notice"
          label="Notice"
        />
        <NavCardItem
          to="/recharge"
          imgSrc="/assets/icons/nav_ico2.png"
          altText="Recharge"
          label="Recharge"
        />
        <NavCardItem
          to="/withdraw"
          imgSrc="/assets/icons/nav_ico2.png"
          altText="Withdraw"
          label="withdraw"
        />
        {/* <NavCardItem
          to="/bonus-tasks"
          imgSrc="/assets/icons/nav_ico3.png"
          altText="Bonus"
          label="Bonus"
        /> */}
        <NavCardItem
          to="/successful-withdrawals"
          imgSrc="/assets/icons/nav_ico4.png"
          altText="Proof"
          label="Proof"
        />
        <NavCardItem
          to="/user/groups"
          imgSrc="/assets/icons/nav_ico4.png"
          altText="Groups"
          label="Groups"
        />
      </Row>
    </Container>
  );
};

export default Navigation;
