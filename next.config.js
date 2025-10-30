/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // 기본 1MB → 5MB로 증가
    },
  },
}

module.exports = nextConfig
