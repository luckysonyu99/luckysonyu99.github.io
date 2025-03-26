/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['luckysonyu99.supabase.co'],
  },
  assetPrefix: '',
  trailingSlash: true,  // 保留尾部斜杠
}

module.exports = nextConfig 