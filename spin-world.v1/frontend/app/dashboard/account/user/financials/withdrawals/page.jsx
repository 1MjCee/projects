import React from "react";
import { Container } from "react-bootstrap";
import Withdraw from "@/app/components/Financials/Withdraw";
import Head from "next/head";

const Withdrawals = () => {
  return (
    <>
      <Head>
        {/* Page Title */}
        <title>Withdraw Earnings - Spin World</title>

        {/* Meta Description */}
        <meta
          name="description"
          content="Withdraw your earnings from Spin World! Enjoy fast and secure withdrawals of your winnings. Get your real dollars in no time."
        />

        {/* Open Graph Tags (for Social Sharing) */}
        <meta property="og:title" content="Withdraw Earnings - Spin World" />
        <meta
          property="og:description"
          content="Withdraw your earnings from Spin World! Enjoy fast and secure withdrawals of your winnings. Get your real dollars in no time."
        />
        <meta
          property="og:image"
          content="https://spin-world.site/assets/images/logo/spin-logo.png"
        />
        <meta
          property="og:url"
          content="https://spin-world.site/dashboard/account/user/financials/withdrawals"
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card Tags (Optional, for Twitter Sharing) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Withdraw Earnings - Spin World" />
        <meta
          name="twitter:description"
          content="Withdraw your earnings from Spin World! Enjoy fast and secure withdrawals of your winnings. Get your real dollars in no time."
        />
        <meta
          name="twitter:image"
          content="https://spin-world.site/assets/images/logo/spin-logo.png"
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href="https://spin-world.site/dashboard/account/user/financials/withdrawals"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Viewport Meta Tag */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Structured Data (Schema Markup) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Withdraw Earnings - Spin World",
            url: "https://spin-world.site/dashboard/account/user/financials/withdrawals",
            description:
              "Withdraw your earnings from Spin World! Enjoy fast and secure withdrawals of your winnings. Get your real dollars in no time.",
            image: "https://spin-world.site/assets/images/logo/spin-logo.png",
          })}
        </script>
      </Head>
      <Container fluid className="px-0" style={{ marginBottom: "100px" }}>
        <Withdraw />
      </Container>
    </>
  );
};

export default Withdrawals;
