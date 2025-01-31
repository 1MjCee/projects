import UserLogin from "@/app/components/Forms/LoginForm";
import React from "react";
import { Container } from "react-bootstrap";
import Head from "next/head";

const page = () => {
  return (
    <>
      <Head>
        {/* Page Title */}
        <title>Login to Spin World - Win Real Dollars with Every Spin!</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Log in to Spin World and start spinning the roulette wheel to win real dollars! Join now for exciting rewards, instant payouts, and endless fun."
        />

        {/* Open Graph Tags (for Social Sharing) */}
        <meta
          property="og:title"
          content="Login to Spin World - Win Real Dollars with Every Spin!"
        />
        <meta
          property="og:description"
          content="Log in to Spin World and start spinning the roulette wheel to win real dollars! Join now for exciting rewards, instant payouts, and endless fun."
        />
        <meta
          property="og:image"
          content="https://spin-world.site/assets/images/logo/spin-logo.png"
        />
        <meta property="og:url" content="https://spin-world.site/auth/login" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags (Optional, for Twitter Sharing) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Login to Spin World - Win Real Dollars with Every Spin!"
        />
        <meta
          name="twitter:description"
          content="Log in to Spin World and start spinning the roulette wheel to win real dollars! Join now for exciting rewards, instant payouts, and endless fun."
        />
        <meta
          name="twitter:image"
          content="https://spin-world.site/assets/images/logo/spin-logo.png"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://spin-world.site/auth/login" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Viewport Meta Tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Structured Data (Schema Markup) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Login to Spin World",
            url: "https://spin-world.site/auth/login",
            description:
              "Log in to Spin World and start spinning the roulette wheel to win real dollars! Join now for exciting rewards, instant payouts, and endless fun.",
            image: "https://spin-world.site/assets/images/logo/spin-logo.png",
          })}
        </script>
      </Head>
      <Container fluid className="px-0">
        <UserLogin />
      </Container>
    </>
  );
};

export default page;
