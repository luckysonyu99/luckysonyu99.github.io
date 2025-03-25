# Luca's Growing Journey API

这是 Luca's Growing Journey 的后端 API 服务。

## 功能特点

- 📝 提供成长记录的 CRUD 接口
- 🖼️ 照片管理 API
- 🔐 用户认证和授权
- 📊 数据统计接口

## 技术栈

- Node.js
- Express
- MongoDB
- Mongoose
- CORS

## 本地开发

1. 克隆仓库：
```bash
git clone [你的仓库地址]
cd luca-is-growing-api
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
复制 `.env.example` 文件为 `.env` 并填写必要的配置信息。

4. 启动开发服务器：
```bash
npm run dev
```

服务器将在 http://localhost:3001 运行。

## API 文档

### 健康检查
- GET `/api/health`

### 成长记录
- GET `/api/records` - 获取所有记录
- POST `/api/records` - 创建新记录
- GET `/api/records/:id` - 获取特定记录
- PUT `/api/records/:id` - 更新记录
- DELETE `/api/records/:id` - 删除记录

### 照片管理
- GET `/api/photos` - 获取所有照片
- POST `/api/photos` - 上传新照片
- DELETE `/api/photos/:id` - 删除照片

## 部署

项目可以部署到任何支持 Node.js 的平台，如：
- Heroku
- DigitalOcean
- AWS
- 自托管服务器

## 许可证

MIT License
