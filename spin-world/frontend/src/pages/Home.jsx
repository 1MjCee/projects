import { Container } from "react-bootstrap";
import Roulette from "../components/Games/Wheel";
import RankingDashCard from "../components/Rewards/RankingDashCard";
import Winners from "../components/Games/Winners";
import UserProfile from "../components/Account/UserProfile";
import ReviewsList from "../components/Reviews/ReviewList";

const Home = () => {
  return (
    <Container fluid className="p-0">
      <UserProfile />
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
