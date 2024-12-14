import React from "react";
import Roulette from "../components/Games/Wheel";
import SubHeader from "../components/SubHeader";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import Winners from "../components/Games/Winners";

const Game = () => {
  const prizes = [
    { text: "Prize 1" },
    { text: "Prize 2" },
    { text: "Prize 3" },
    { text: "Prize 4" },
    { text: "Prize 5" },
    { text: "Prize 6" },
    { text: "Prize 7" },
    { text: "Prize 8" },
    { text: "Prize 10" },
    { text: "Prize 11" },
    { text: "Prize 12" },
    { text: "Prize 13" },
    { text: "Prize 14" },
    { text: "Prize 15" },
    { text: "Prize 16" },
    { text: "Prize 17" },
    { text: "Prize 18" },
  ];

  return (
    <Container fluid className="p-0">
      <header className="mt-5 mb-4">
        <h1
          style={{ color: "#FF8C00", fontWeight: "bold" }}
          className="text-center mt-5 mb-2"
        >
          Roulette Wheel
        </h1>
        <p className="text-center mt-3">
          This roulette wheel provides you with an opportunity to win amazing
          rewards. You can click the spin the wheel to get your reward
        </p>
      </header>
      <hr />
      <Roulette data={prizes} />
      <Winners />
    </Container>
  );
};

export default Game;
