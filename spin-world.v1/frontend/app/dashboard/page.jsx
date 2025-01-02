import { Container } from "react-bootstrap";
import UserInfo from "../components/Home/UserInfo";
import RankingDashCard from "../components/Rewards/RankingDashCard";
import Roulette from "../components/Games/Wheel";
import Winners from "../components/Games/Winners";
import ReviewsList from "../components/Reviews/ReviewList";
import BalanceInfo from "../components/Account/BalanceInfo";

const Home = () => {
  return (
    <Container fluid className="p-0" style={{ marginBottom: "100px" }}>
      <UserInfo />
      <BalanceInfo />
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
