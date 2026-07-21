import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // Server-side rendering on Netlify — routes work natively, no redirect hacks needed
};

export default nextConfig;
