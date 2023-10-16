/** @type {import('next').NextConfig} */

// @ts-ignore
// const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  experimental: {
    // Defaults to 50MB
    isrMemoryCacheSize: 0, // cache size in bytes
  },
  // Use the CDN in production and localhost for development.
  // assetPrefix: isProd ? 'https://d2p8t30rkjz869.cloudfront.net' : undefined,
};
