/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // GitHub Pages 不支持 Next.js 的图片优化
  },
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,  // 保留尾部斜杠
}

module.exports = nextConfig 