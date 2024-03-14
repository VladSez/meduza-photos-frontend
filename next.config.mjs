// this import is used to validate schema on build
// More info: https://env.t3.gg/docs/nextjs#validate-schema-on-build-(recommended)
import "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/feed",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meduza.io",
        port: "",
      },
    ],

    // custom loader is broken for some reason, maybe my proxy is blocked. not sure
    // loader: "custom",
    // loaderFile: "./src/lib/image-loader.ts",

    // main concern is cost
    unoptimized: true,
  },
};

export default nextConfig;
