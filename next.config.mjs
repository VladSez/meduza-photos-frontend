/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
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
  // https://github.com/vercel/next.js/discussions/33632#discussioncomment-6377747
  async headers() {
    return [
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
        source:
          "/:path(.+\\.(?:ico|png|svg|jpg|jpeg|avif|gif|webp|json|js|css|mp3|mp4|ttf|ttc|otf|woff|woff2)$)",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meduza.io",
      },
    ],
    // unoptimized: true,
  },
};

export default nextConfig;
