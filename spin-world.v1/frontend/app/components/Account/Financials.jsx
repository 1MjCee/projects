import React from "react";
import { Row, Col, Card, Container } from "react-bootstrap";
import { FaWallet, FaArrowCircleDown } from "react-icons/fa";
import Link from "next/link";

const Financials = () => {
  return (
    <Container fluid className="mt-3">
      <Card style={{ backgroundColor: "#03002e" }}>
        <Card.Body>
          <Row className="text-center">
            <Col>
              <Link
                href="/dashboard/account/user/financials/deposits"
                passHref
                className="text-decoration-none"
              >
                <FaWallet size={25} color="#DA9100" className="mb-2" />
                <span className="d-block text-light">Deposit</span>
              </Link>
            </Col>
            <Col>
              <Link
                href="/dashboard/account/user/financials/withdrawals"
                passHref
                className="text-decoration-none"
              >
                <FaArrowCircleDown size={25} color="#DA9100" className="mb-2" />
                <span className="d-block text-light">Withdraw</span>
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Financials;
