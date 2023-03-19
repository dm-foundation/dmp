/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname:
          "**.ipfs.localhost",
        port: "8080",
      },
    ],
  },
};

export default nextConfig;
