/**import nextPWA from "next-pwa"; 

/** @type {import('next').NextConfig} 

const nextConfig = { 

  reactStrictMode: true, 

}; 

// Exporta la config envuelta con next-pwa 

export default nextPWA({ 

  dest: "public", 

  register: true, 

  skipWaiting: true, 

})(nextConfig); */
import nextPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
};

export default nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig);
