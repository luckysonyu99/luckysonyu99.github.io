/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 启用静态导出
  basePath: process.env.NODE_ENV === 'production' ? '/luca-is-growing.github.io' : '',
  images: {
    unoptimized: true, // GitHub Pages 不支持 Next.js 的图片优化
  },
}

module.exports = nextConfig 