@echo off
echo 🔍 检查发布前准备...
echo.

REM 检查 dist 目录
if not exist "dist" (
  echo ❌ dist 目录不存在，请先运行: npm run build
  exit /b 1
)

if not exist "dist\index.html" (
  echo ❌ dist\index.html 不存在，构建可能失败
  exit /b 1
)

echo ✅ dist 目录存在

REM 检查 bin 目录
if not exist "bin\cc-help.js" (
  echo ❌ bin\cc-help.js 不存在
  exit /b 1
)

echo ✅ bin\cc-help.js 存在

REM 检查 package.json
if not exist "package.json" (
  echo ❌ package.json 不存在
  exit /b 1
)

echo ✅ package.json 存在

REM 检查 README
if not exist "README.md" (
  echo ⚠️  README.md 不存在（建议添加）
) else (
  echo ✅ README.md 存在
)

echo.
echo 🎉 所有检查通过！可以发布了
echo.
echo 下一步：
echo 1. npm login          # 登录 npm
echo 2. npm version patch  # 更新版本号
echo 3. npm publish        # 发布到 npm
