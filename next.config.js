/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['luckysonyu99.supabase.co'],
  },
  assetPrefix: '',
  trailingSlash: true,  // 保留尾部斜杠
}

module.exports = nextConfig 