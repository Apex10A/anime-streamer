import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'gogocdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img1.ak.crunchyroll.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'artworks.thetvdb.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.kitsu.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.noitatnemucod.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.flawlessfiles.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sup-proxy.zephex0-f6c.workers.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.animeplanet.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'animeplanet.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
