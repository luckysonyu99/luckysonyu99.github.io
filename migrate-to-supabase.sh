#!/bin/bash

# Luca's Growing - Supabase 迁移脚本
# 此脚本将自动完成从 Userbase 到 Supabase 的迁移

set -e

echo "🦖 开始迁移 Luca's Growing 到 Supabase..."
echo ""

# 1. 检查是否在项目根目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

echo "✅ 检测到项目目录"
echo ""

# 2. 备份旧文件
echo "📦 备份旧文件..."
mkdir -p .backup
cp lib/auth.ts .backup/auth-old.ts 2>/dev/null || true
cp app/contexts/AuthContext.tsx .backup/AuthContext-old.tsx 2>/dev/null || true
cp app/admin/gallery/page.tsx .backup/gallery-old.tsx 2>/dev/null || true
cp app/admin/milestones/page.tsx .backup/milestones-old.tsx 2>/dev/null || true
echo "✅ 备份完成"
echo ""

# 3. 安装依赖
echo "📦 安装 Supabase 依赖..."
npm install @supabase/supabase-js@^2.39.3 @supabase/auth-helpers-nextjs@^0.8.7
npm uninstall userbase-js
echo "✅ 依赖安装完成"
echo ""

# 4. 替换文件
echo "🔄 替换核心文件..."
mv lib/auth-new.ts lib/auth.ts
mv app/contexts/AuthContext-new.tsx app/contexts/AuthContext.tsx
echo "✅ 文件替换完成"
echo ""

# 5. 检查环境变量
echo "🔍 检查环境变量..."
if [ ! -f ".env.local" ]; then
    echo "⚠️  警告：未找到 .env.local 文件"
    echo "请手动创建 .env.local 文件并添加以下内容："
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://krcihnwfatzhjlkchdrm.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key"
    echo ""
else
    echo "✅ 找到 .env.local 文件"
fi
echo ""

# 6. 提示下一步
echo "🎉 迁移脚本执行完成！"
echo ""
echo "📋 接下来请完成以下步骤："
echo ""
echo "1. 在 Supabase Dashboard 中执行 SQL 脚本："
echo "   - 打开 https://supabase.com/dashboard"
echo "   - 选择你的项目"
echo "   - 点击 SQL Editor"
echo "   - 复制并执行 supabase-schema.sql 的内容"
echo ""
echo "2. 创建管理员账号："
echo "   - 在 Supabase Dashboard 的 Authentication > Users"
echo "   - 创建用户：admin@luca.com / luca2024"
echo ""
echo "3. 启动开发服务器："
echo "   npm run dev"
echo ""
echo "4. 访问 http://localhost:3000/admin/login 测试登录"
echo ""
echo "📖 详细文档请查看 MIGRATION_GUIDE.md"
echo ""
