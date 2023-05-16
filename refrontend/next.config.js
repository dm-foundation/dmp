/** @type {import('next').NextConfig} */
const nextConfig = {

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
}

module.exports = nextConfig
