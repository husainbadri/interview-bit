import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@untitledui/icons",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-slot",
    ],
  },
};

export default nextConfig;
