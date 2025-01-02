import NavigationAuthBar from "./components/Landing/AuthMenu";
import HeroSection from "./components/Landing/Hero";
import StepProgress from "./components/Landing/StepProcess";
import LandingRoulette from "./components/Landing/Wheel";
import LandingWinners from "./components/Landing/Winners";
import ReviewsList from "./components/Reviews/ReviewList";

export default function Home() {
  return (
    <div>
      <NavigationAuthBar />
      <HeroSection />
      <LandingRoulette />
      <StepProgress />
      <LandingWinners />
      <ReviewsList />
    </div>
  );
}
