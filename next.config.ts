import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
    proxyClientMaxBodySize: "6mb",
  },
};

export default nextConfig;
