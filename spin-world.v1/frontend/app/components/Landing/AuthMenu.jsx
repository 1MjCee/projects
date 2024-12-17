"use client";

import React from "react";
import { Navbar, Nav, Container, Button, Row, Col } from "react-bootstrap";
import Link from "next/link";

const NavigationAuthBar = () => {
  return (
    <Navbar className="mt-2" style={{ backgroundColor: "#010048" }} expand="lg">
      <Container>
        <Row style={{ width: "100%", height: "100px" }} className="w-100">
          {/* Logo on the left */}
          <Col md={8} xs={6} className="d-flex align-items-center">
            <Navbar.Brand className="p-0" href="/">
              <img
                src="/assets/logo/spin-logo.png"
                alt="Logo"
                style={{ height: "100px" }}
              />
            </Navbar.Brand>
          </Col>

          {/* Login and Sign Up on the right */}
          <Col
            md={4}
            xs={6}
            className="d-flex justify-content-end align-items-center gap-3"
          >
            <Nav.Item>
              <Nav.Link as={Link} href="/auth/login" className="text-light">
                Login
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} href="/auth/register" className="text-end">
                <Button variant="outline-light">Register</Button>
              </Nav.Link>
            </Nav.Item>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default NavigationAuthBar;
