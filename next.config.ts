import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/clubs/microsoft club',
        destination: '/clubs/microsoft-club',
        permanent: true,
      },
      {
        source: '/clubs/microsoft%20club',
        destination: '/clubs/microsoft-club',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
