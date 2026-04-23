import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": ["remotion/**", "buttercut/**", "photos/**", "audio/**"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
