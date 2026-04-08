import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // 정적 HTML 내보내기 (Cloudflare Pages)
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
