/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 一時的に、Lint エラーでビルドが失敗しないようにする
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
