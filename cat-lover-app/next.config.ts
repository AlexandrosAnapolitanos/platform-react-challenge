import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // I have deveoped the app in strict mode but I want it also to
  // simulate prod environment as it is being evaluated
  reactStrictMode: false,
  images: {
    domains: ["cdn2.thecatapi.com"],
  },
};

export default nextConfig;
