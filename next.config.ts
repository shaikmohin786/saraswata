import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/gallery/gallery", destination: "/gallery", permanent: true },
      { source: "/videos/videos", destination: "/videos", permanent: true },
      { source: "/posts/posts", destination: "/posts", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.youtube.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
