import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/auth", destination: "/vault", permanent: false }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.pokicdn.com",
      },
      {
        protocol: "https",
        hostname: "img.gamemonetize.com",
      },
      {
        protocol: "https",
        hostname: "gamemonetize.com",
      },
      {
        protocol: "https",
        hostname: "html5.gamemonetize.co",
      },
      {
        protocol: "https",
        hostname: "*.gamemonetize.com",
      },
    ],
  },
};

export default nextConfig;
