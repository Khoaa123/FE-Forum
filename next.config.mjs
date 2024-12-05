/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/forum/:slug*",
  //       destination: "/forum/:slug*",
  //     },
  //   ];
  // },
};

export default nextConfig;
