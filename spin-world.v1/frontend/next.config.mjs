/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "",
  images: {
    domains: ["127.0.0.1", "localhost", "https://spin-world.site"],
  },

  // Define environment variables
  env: {
    NEXT_PUBLIC_APP_SITE_URL: "https://spin-world.site",
    NEXT_PUBLIC_API_URL: "http://127.0.0.1:8000",
    NEXT_PUBLIC_ENCRYPTION_KEY:
      "9510936fec41b4b4d73af41ff4fcbd4707c94e38769c90ab8aec74c25b047cd5",
  },
};

export default nextConfig;
