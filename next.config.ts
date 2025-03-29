import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // ppr: 'incremental', // ❌ Removed this to fix the CanaryOnlyError
  },
  async redirects() {
    return [
      {
        source: '/navegation',
        destination: '/ui/navegation',
        permanent: true,
      },
      {
        source: '/navegation/:path*',
        destination: '/ui/navegation/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
