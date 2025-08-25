/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/kantan-chouhyo' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/kantan-chouhyo/' : '',
};

export default nextConfig;
