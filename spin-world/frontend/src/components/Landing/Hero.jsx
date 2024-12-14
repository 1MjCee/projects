import React, { useEffect } from "react";
import { Container, Alert, Row, Col, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats, selectStats } from "../../store/slices/StatsSlice";

const HeroSection = () => {
  const dispatch = useDispatch();

  // Access stats from Redux store
  const { amountToBeWon, customersToday, totalCustomers, status } =
    useSelector(selectStats);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <section className="hero p-1" style={heroSectionStyle}>
      <hr />
      <Container className="px-0" fluid>
        <Row className="justify-content-center gx-1 text-center">
          <Col xs={12} className="mb-3">
            <h5 style={{ color: "#DA9100" }} className="display-6 px-3">
              Welcome to the Winning Zone!
            </h5>
            <p className="text-light">
              See today's exciting stats and be part of the action!
            </p>
          </Col>

          <Col xs={12} className="mb-2">
            <Card className="text-center" style={cardStyle}>
              <Card.Body>
                <h4 style={{ fontWeight: "350" }}>USD {amountToBeWon}</h4>
                <p className="text-light lead">Prizes to be Won</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} sm={12} xs={6} className="mb-2">
            <Card className="text-center" style={cardStyle}>
              <Card.Body>
                <h4 style={{ fontWeight: "350" }}>{customersToday}</h4>
                <p className="lead text-light">Users Today</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} sm={12} xs={6} className="mb-2">
            <Card className="text-center" style={cardStyle}>
              <Card.Body>
                <h4 style={{ fontWeight: "350" }}>{totalCustomers}</h4>
                <p className="lead text-light">Total Users</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* CTA Button */}
        <Row className="justify-content-center align-items-center mt-3">
          <Col xs={12} className="text-center">
            <Button
              variant="primary"
              className="w-50 mx-auto"
              size="lg"
              href="/register"
            >
              Get Started
            </Button>
          </Col>
        </Row>

        <hr />
      </Container>
    </section>
  );
};

// Hero section styles
const heroSectionStyle = {
  color: "white",
};

// Card styles for stats
const cardStyle = {
  backgroundColor: "#03002e",
  borderRadius: "8px",
  color: "#DA9100",
};

export default HeroSection;
