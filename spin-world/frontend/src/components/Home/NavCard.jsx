import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavCardItem = ({ to, imgSrc, altText, label }) => {
  return (
    <Col md={2} xs={3} className="mb-3">
      <Link to={to} className="text-decoration-none text-center">
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "15px",
            padding: "5px 10px",
            transition: "0.3s",
            textAlign: "center",
          }}
          className="card-item"
        >
          <img
            style={{
              paddingTop: "5px",
              height: "25px",
              width: "25px",
              display: "block",
              margin: "0 auto",
            }}
            src={imgSrc}
            alt={altText}
          />
          <p
            style={{
              marginTop: "5px",
              fontSize: "12px",
              color: "#222",
            }}
          >
            {label}
          </p>
        </div>
      </Link>
    </Col>
  );
};

export default NavCardItem;
