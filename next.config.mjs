/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows the production build to complete even if there are ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This allows the production build to complete even if there are TS errors.
    ignoreBuildErrors: true,
  }
};

export default nextConfig;