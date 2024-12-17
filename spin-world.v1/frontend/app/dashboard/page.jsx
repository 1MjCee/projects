import { Container } from "react-bootstrap";
import UserInfo from "../components/Home/UserInfo";
import RankingDashCard from "../components/Rewards/RankingDashCard";
import Roulette from "../components/Games/Wheel";
import Winners from "../components/Games/Winners";
import ReviewsList from "../components/Reviews/ReviewList";

const Home = () => {
  return (
    <Container fluid className="p-0">
      <UserInfo />
      <RankingDashCard />
      <div>
        <Roulette />
      </div>
      <Winners />
      <ReviewsList />
    </Container>
  );
};

export default Home;
