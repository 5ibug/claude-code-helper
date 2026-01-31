#!/bin/bash

echo "🔍 检查发布前准备..."
echo ""

# 检查 dist 目录
if [ ! -d "dist" ]; then
  echo "❌ dist 目录不存在，请先运行: npm run build"
  exit 1
fi

if [ ! -f "dist/index.html" ]; then
  echo "❌ dist/index.html 不存在，构建可能失败"
  exit 1
fi

echo "✅ dist 目录存在"

# 检查 bin 目录
if [ ! -f "bin/cc-help.js" ]; then
  echo "❌ bin/cc-help.js 不存在"
  exit 1
fi

echo "✅ bin/cc-help.js 存在"

# 检查 package.json
if [ ! -f "package.json" ]; then
  echo "❌ package.json 不存在"
  exit 1
fi

echo "✅ package.json 存在"

# 检查必要字段
if ! grep -q '"name"' package.json; then
  echo "❌ package.json 缺少 name 字段"
  exit 1
fi

if ! grep -q '"version"' package.json; then
  echo "❌ package.json 缺少 version 字段"
  exit 1
fi

echo "✅ package.json 配置正确"

# 检查 README
if [ ! -f "README.md" ]; then
  echo "⚠️  README.md 不存在（建议添加）"
else
  echo "✅ README.md 存在"
fi

echo ""
echo "🎉 所有检查通过！可以发布了"
echo ""
echo "下一步："
echo "1. npm login          # 登录 npm"
echo "2. npm version patch  # 更新版本号"
echo "3. npm publish        # 发布到 npm"
