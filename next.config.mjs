/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
