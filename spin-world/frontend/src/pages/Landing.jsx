import React from "react";
import { Container } from "react-bootstrap";
import LandingRoulette from "../components/Landing/Wheel";
import LandingWinners from "../components/Landing/Winners";
import NavigationAuthBar from "../components/Landing/AuthMenu";
import HeroSection from "../components/Landing/Hero";
import StepProgress from "../components/Landing/StepProcess";
import ReviewsList from "../components/Reviews/ReviewList";

const Landing = () => {
  return (
    <Container fluid style={{ backgroundColor: "#010048" }}>
      <NavigationAuthBar />
      <HeroSection />
      <LandingRoulette />
      <StepProgress />
      <LandingWinners />
      <ReviewsList />
    </Container>
  );
};

export default Landing;
