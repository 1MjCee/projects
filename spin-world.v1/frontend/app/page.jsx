import NavigationAuthBar from "./components/Landing/AuthMenu";
import HeroSection from "./components/Landing/Hero";
import StepProgress from "./components/Landing/StepProcess";
import LandingRoulette from "./components/Landing/Wheel";
import LandingWinners from "./components/Landing/Winners";
import ReviewsList from "./components/Reviews/ReviewList";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        {/* Page Title */}
        <title>Spin World - Win Real Dollars with Every Spin!</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Spin the roulette wheel at Spin World and win real dollars with every spin! Join now for exciting rewards, instant payouts, and endless fun. Try your luck today!"
        />

        {/* Open Graph Tags (for Social Sharing) */}
        <meta
          property="og:title"
          content="Spin World - Win Real Dollars with Every Spin!"
        />
        <meta
          property="og:description"
          content="Spin the roulette wheel at Spin World and win real dollars with every spin! Join now for exciting rewards, instant payouts, and endless fun. Try your luck today!"
        />
        <meta
          property="og:image"
          content="https://spin-world.site/assets/images/logo/spin-logo.png"
        />
        <meta property="og:url" content="https://spin-world.site" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags (Optional, for Twitter Sharing) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Spin World - Win Real Dollars with Every Spin!"
        />
        <meta
          name="twitter:description"
          content="Spin the roulette wheel at Spin World and win real dollars with every spin! Join now for exciting rewards, instant payouts, and endless fun. Try your luck today!"
        />
        <meta
          name="twitter:image"
          content="https://spin-world.site/assets/images/logo/spin-logo.png"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://spin-world.site" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Viewport Meta Tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Structured Data (Schema Markup) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Website",
            name: "Spin World",
            url: "https://spin-world.site",
            description:
              "Spin the roulette wheel at Spin World and win real dollars with every spin! Join now for exciting rewards, instant payouts, and endless fun.",
            image: "https://spin-world.site/assets/images/logo/spin-logo.png",
          })}
        </script>
      </Head>
      <div>
        <NavigationAuthBar />
        <HeroSection />
        <LandingRoulette />
        <StepProgress />
        <LandingWinners />
        <ReviewsList />
      </div>
    </>
  );
}
