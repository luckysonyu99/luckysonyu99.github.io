/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 启用静态导出
  images: {
    unoptimized: true, // GitHub Pages 不支持 Next.js 的图片优化
  },
  basePath: '/luckysonyu99.github.io',
  assetPrefix: '/luckysonyu99.github.io/',
  trailingSlash: true,  // 保留尾部斜杠
}

module.exports = nextConfig 