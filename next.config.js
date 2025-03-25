/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 启用静态导出
  images: {
    unoptimized: true, // GitHub Pages 不支持 Next.js 的图片优化
  },
  assetPrefix: '.',  // 添加资源前缀
  trailingSlash: true,  // 添加尾部斜杠
}

module.exports = nextConfig 