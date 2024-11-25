/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    remotePatterns: [
      {
        hostname: "agente007.blob.core.windows.net",
      },
    ],
  },
};

export default nextConfig;
