import { Container } from "react-bootstrap";
import UserInfo from "../components/Home/UserInfo";
import RankingDashCard from "../components/Rewards/RankingDashCard";
import Roulette from "../components/Games/Wheel";
import Winners from "../components/Games/Winners";
import ReviewsList from "../components/Reviews/ReviewList";
import BalanceInfo from "../components/Account/BalanceInfo";
import Head from "next/head";

const Home = () => {
  return (
    <>
      <Head>
        {/* Page Title */}
        <title>Dashboard - Spin World</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Welcome to your Spin World dashboard! Track your balance, spin the roulette wheel, and see your rankings. Start winning real dollars today!"
        />

        {/* Open Graph Tags (for Social Sharing) */}
        <meta property="og:title" content="Dashboard - Spin World" />
        <meta
          property="og:description"
          content="Welcome to your Spin World dashboard! Track your balance, spin the roulette wheel, and see your rankings. Start winning real dollars today!"
        />
        <meta
          property="og:image"
          content="https://spin-world.site/assets/images/logo/spin-logo.png"
        />
        <meta property="og:url" content="https://spin-world.site/dashboard" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags (Optional, for Twitter Sharing) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dashboard - Spin World" />
        <meta
          name="twitter:description"
          content="Welcome to your Spin World dashboard! Track your balance, spin the roulette wheel, and see your rankings. Start winning real dollars today!"
        />
        <meta
          name="twitter:image"
          content="https://spin-world.site/assets/images/logo/spin-logo.png"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://spin-world.site/dashboard" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Viewport Meta Tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Structured Data (Schema Markup) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Dashboard - Spin World",
            url: "https://spin-world.site/dashboard",
            description:
              "Welcome to your Spin World dashboard! Track your balance, spin the roulette wheel, and see your rankings. Start winning real dollars today!",
            image: "https://spin-world.site/assets/images/logo/spin-logo.png",
          })}
        </script>
      </Head>
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
    </>
  );
};

export default Home;
