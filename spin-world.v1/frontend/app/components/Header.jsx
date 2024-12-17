import React from "react";
import { Container, Image } from "react-bootstrap";
import "../styles/Header.css";

const Header = ({ title }) => {
  return (
    <header className="header-container">
      <Container>
        <div className="header-image">
          <Image src="/assets/images/cow-image.jpg" alt="Grace Farm" />
        </div>
      </Container>
    </header>
  );
};

export default Header;
