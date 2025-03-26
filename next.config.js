/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // GitHub Pages 不支持 Next.js 的图片优化
  },
  assetPrefix: '',
  trailingSlash: true,  // 保留尾部斜杠
}

module.exports = nextConfig 