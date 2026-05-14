import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: ["@lumora/ui", "@lumora/sdk"],
  experimental: { serverComponentsExternalPackages: ["@stellar/stellar-sdk"] },
};
export default nextConfig;
