/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d9hhrg4mnvzow.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
