import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow three.js + @react-three packages to be transpiled
  transpilePackages: ["three"],

  webpack(config) {
    // Required for @react-three/fiber in Next.js
    config.externals = config.externals || [];
    return config;
  },

  // Silence the workspace root warning from Turbopack
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
