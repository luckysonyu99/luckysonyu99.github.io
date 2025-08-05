/** @type {import('next').NextConfig} */
const nextConfig = {
  // 注释掉 output: 'export' 以支持中间件
  // output: 'export',
  images: {
    unoptimized: true,
    domains: ['luckysonyu99.supabase.co'],
  },
  trailingSlash: true,  // 保留尾部斜杠
  // 移除过时的 serverActions 配置
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });
    return config;
  },
}

module.exports = nextConfig