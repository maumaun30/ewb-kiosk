import type { NextConfig } from "next";

const isStaging = process.env.NEXT_PUBLIC_API_BASE_URL?.includes("stg");

const nextConfig: NextConfig = {
  images: {
    unoptimized: isStaging,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "stg-ewb.quailshack.com",
        port: "",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "https",
        hostname: "dev2.eastwestbanker.com",
        port: "",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "https",
        hostname: "uat2.eastwestbanker.com",
        port: "",
        pathname: "/sites/default/files/**",
      },
      {
        protocol: "https",
        hostname: "eastwestbanker.com",
        port: "",
        pathname: "/sites/default/files/**",
      },
    ],
  },
};

export default nextConfig;
