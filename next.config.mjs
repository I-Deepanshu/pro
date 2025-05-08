/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.huggingface.co',
        pathname: '/**',
      },
    ],
  },
  // Updated webpack configuration to handle Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to import these modules on the client side
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        path: false,
        crypto: false,
        buffer: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        querystring: false,
        url: false,
      };
    }
    return config;
  },
  // Explicitly mark these routes as server-side only
  experimental: {
    serverComponentsExternalPackages: ["fs", "path", "crypto"],
  },
};

export default nextConfig;
