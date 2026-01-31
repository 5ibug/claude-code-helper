#!/bin/bash

echo "🚀 准备发布到 npm..."
echo ""

# 检查是否已登录
if ! npm whoami > /dev/null 2>&1; then
  echo "❌ 未登录 npm，请先运行: npm login"
  exit 1
fi

echo "✅ 已登录为: $(npm whoami)"
echo ""

# 构建前端
echo "📦 构建前端..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ 构建失败"
  exit 1
fi

echo "✅ 构建成功"
echo ""

# 预览将要发布的文件
echo "📋 将要发布的文件："
npm pack --dry-run

echo ""
echo "⚠️  请确认以上文件列表正确"
echo ""
read -p "是否继续发布? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 取消发布"
  exit 1
fi

# 发布
echo "🚀 发布中..."
npm publish

if [ $? -eq 0 ]; then
  echo ""
  echo "🎉 发布成功！"
  echo ""
  echo "用户现在可以通过以下方式使用："
  echo "  npm install -g cc-help"
  echo "  npx cc-help"
else
  echo ""
  echo "❌ 发布失败，请检查错误信息"
  exit 1
fi
