/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  experimental: {
    // Defaults to 50MB
    isrMemoryCacheSize: 0, // cache size in bytes
  },
};
