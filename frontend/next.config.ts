import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Allow connections from the local network IP for mobile testing
  allowedDevOrigins: [
    "http://192.168.1.227:3000",
    "http://192.168.1.227"
  ],
};

export default nextConfig;
