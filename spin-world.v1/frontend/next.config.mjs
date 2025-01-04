/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "spin-world.site",
        port: "",
        pathname: "/media/uploads/**",
      },
    ],
  },
  // Define environment variables
  env: {
    NEXT_PUBLIC_APP_SITE_URL: "https://spin-world.site",
    NEXT_PUBLIC_API_URL: "https://spin-world.site",
    NEXT_PUBLIC_ENCRYPTION_KEY:
      "9510936fec41b4b4d73af41ff4fcbd4707c94e38769c90ab8aec74c25b047cd5",
  },
};

export default nextConfig;
