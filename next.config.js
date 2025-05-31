/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  
  // External packages for server components (moved out of experimental)
  serverExternalPackages: [
    '@neondatabase/serverless'
  ],
  
  // Performance optimizations (stable features only)
  experimental: {
    // Reduce bundle size
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
  
  // Output configuration for better performance
  output: 'standalone',
  
  // Cache configuration
  async headers() {
    return [
      {
        source: '/api/templates',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=30, stale-while-revalidate=60',
          },
        ],
      },
      {
        source: '/api/templates/:id',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
      // Security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  
  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer }) => {
    return config
  },
  
  // Build-time optimizations
  // swcMinify is now enabled by default in Next.js 15
  
  // Runtime optimizations
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Optimize for serverless
  async rewrites() {
    return []
  },
};

module.exports = nextConfig;
