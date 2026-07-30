import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/clubs/microsoft%20club',
        destination: '/clubs/microsoft-club',
        permanent: true,
      },
      {
        source: '/clubs/microsoft club',
        destination: '/clubs/microsoft-club',
        permanent: true,
      },
      {
        source: '/clubs/music%20dance%20club',
        destination: '/clubs/music-dance-club',
        permanent: true,
      },
      {
        source: '/clubs/music dance club',
        destination: '/clubs/music-dance-club',
        permanent: true,
      },
      {
        source: '/clubs/music-and-dance-club',
        destination: '/clubs/music-dance-club',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
