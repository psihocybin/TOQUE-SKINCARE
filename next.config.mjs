import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const pwaWrapper = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default pwaWrapper(nextConfig);
