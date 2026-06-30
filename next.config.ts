import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,

  compiler: {
    styledComponents: true,
  },

  images: {
    formats: ['image/webp'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'vercel.app' },
      // { protocol: 'https', hostname: 'res.cloudinary.com' },
      // { protocol: 'https', hostname: 'drive.google.com' },
      // {
      //   protocol: 'https',
      //   hostname: 'heydealer-api.s3.amazonaws.com',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'prnd-car-purchase.s3.ap-northeast-2.amazonaws.com',
      //   pathname: '/**',
      // },
    ],
  },

  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js', //
      },
    },
  },
};

export default nextConfig;
