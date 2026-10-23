import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dg1.fundraiseit.org",
        pathname: "/image/cache/catalog/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/admin/fulfill", destination: "/fulfill", permanent: false },
      { source: "/products/:slug*", destination: "/", permanent: true },
      { source: "/cart", destination: "/", permanent: true },
      { source: "/checkout", destination: "/", permanent: true },
      { source: "/checkout/success", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
