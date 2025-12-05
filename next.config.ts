import type { NextConfig } from "next";
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'

const UPLOADTHING_APP_ID = process.env.UPLOADTHING_APP_ID

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Only apply the plugin to the server-side bundles
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https"
      },
      {
        protocol: "https",
        hostname: `${UPLOADTHING_APP_ID}.ufs.sh`,
        pathname: "/f/*",
      },
    ]
  }
};

export default nextConfig;
