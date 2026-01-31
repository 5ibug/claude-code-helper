@echo off
echo ? 准备发布到 npm...
echo.

REM 检查是否已登录
npm whoami >nul 2>&1
if errorlevel 1 (
  echo ? 未登录 npm，请先运行: npm login
  exit /b 1
)

for /f "delims=" %%i in ('npm whoami') do set USERNAME=%%i
echo ? 已登录为: %USERNAME%
echo.

REM 构建前端
echo ? 构建前端...
call npm run build

if errorlevel 1 (
  echo ? 构建失败
  exit /b 1
)

echo ? 构建成功
echo.

REM 预览将要发布的文件
echo ? 将要发布的文件：
npm pack --dry-run

echo.
echo ??  请确认以上文件列表正确
echo.
set /p CONFIRM="是否继续发布? (y/n): "

if /i not "%CONFIRM%"=="y" (
  echo ? 取消发布
  exit /b 1
)

REM 发布
echo ? 发布中...
npm publish

if errorlevel 0 (
  echo.
  echo ? 发布成功！
  echo.
  echo 用户现在可以通过以下方式使用：
  echo   npm install -g cc-help
  echo   npx cc-help
) else (
  echo.
  echo ? 发布失败，请检查错误信息
  exit /b 1
)
