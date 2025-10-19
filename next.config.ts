import { type NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  compiler: {
    removeConsole: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // 소스맵 비활성화
  productionBrowserSourceMaps: false,
  experimental: {
    // Webpack 빌드 워커 활성화
    webpackBuildWorker: true,
    // Webpack 메모리 최적화
    webpackMemoryOptimizations: true,
    // 서버 소스맵 비활성화
    serverSourceMaps: false,
    serverActions: {
      bodySizeLimit: '50mb',
    },
    reactCompiler: true,
  },
  output: 'standalone',
  typedRoutes: true,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
