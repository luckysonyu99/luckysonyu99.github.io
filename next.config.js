/** @type {import('next').NextConfig} */
const nextConfig = {


  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com"],
  },
  trailingSlash: true,  // 保留尾部斜杠
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });
    return config;
  },
}

module.exports = nextConfig

