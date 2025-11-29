import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
};

const isDev = process.env.NODE_ENV === "development";

export default nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev, // <-- IMPORTANT: desactiva PWA en dev
})(nextConfig);
