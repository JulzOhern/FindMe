import type { NextConfig } from "next";

const UPLOADTHING_APP_ID = process.env.UPLOADTHING_APP_ID

const nextConfig: NextConfig = {
  /* config options here */
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
