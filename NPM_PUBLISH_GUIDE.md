# 📦 NPM 发布完整指南

## ✅ 已完成的配置

1. **package.json 配置**
   - ✅ `bin` 字段：指定命令行入口 `cc-help`
   - ✅ `files` 字段：指定发布的文件
   - ✅ `prepublishOnly` 脚本：发布前自动构建
   - ✅ `engines` 字段：指定 Node.js 版本要求
   - ✅ `repository`、`bugs`、`homepage` 字段

2. **文件结构**
   - ✅ `bin/cc-help.js`：CLI 入口文件（带 shebang）
   - ✅ `src/`：后端源代码
   - ✅ `dist/`：前端构建产物
   - ✅ `README.md`：项目说明文档
   - ✅ `.npmignore`：排除不需要的文件

3. **构建脚本**
   - ✅ `npm run build`：构建前端
   - ✅ `npm run start`：本地运行

## 🚀 发布步骤

### 第一步：构建项目
```bash
npm run build
```

### 第二步：测试本地安装
```bash
# 创建全局链接
npm link

# 测试命令
cc-help

# 如果正常运行，取消链接
npm unlink -g cc-help
```

### 第三步：登录 npm
```bash
npm login
# 输入用户名、密码、邮箱
```

### 第四步：检查包名是否可用
```bash
npm search cc-help
```

如果包名已被占用，有两个选择：
1. 修改 `package.json` 中的 `name` 字段
2. 使用作用域包名：`@yourname/cc-help`

### 第五步：发布
```bash
# 首次发布
npm publish

# 如果使用作用域包名
npm publish --access public
```

### 第六步：验证发布
```bash
# 查看包信息
npm info cc-help

# 全局安装测试
npm install -g cc-help

# 运行测试
cc-help

# 使用 npx 测试
npx cc-help
```

## 📝 后续更新流程

1. **修改代码**
2. **构建前端**：`npm run build`
3. **测试功能**
4. **更新版本号**：
   ```bash
   npm version patch   # 1.0.0 -> 1.0.1 (bug 修复)
   npm version minor   # 1.0.0 -> 1.1.0 (新功能)
   npm version major   # 1.0.0 -> 2.0.0 (破坏性更新)
   ```
5. **发布**：`npm publish`

## 🔧 快速检查脚本

Windows:
```bash
scripts\check-publish.bat
```

Linux/Mac:
```bash
bash scripts/check-publish.sh
```

## 📋 发布清单

- [ ] 前端已构建（`dist/` 目录存在）
- [ ] 本地测试通过（`npm link` 测试）
- [ ] README.md 已更新
- [ ] package.json 版本号已更新
- [ ] 已登录 npm（`npm whoami`）
- [ ] 包名可用或已确认
- [ ] 准备发布

## ⚠️ 注意事项

1. **首次发布**：
   - 确保包名未被占用
   - 建议使用作用域包名（如 `@yourname/cc-help`）

2. **版本管理**：
   - 遵循语义化版本规范
   - 每次发布前必须更新版本号

3. **文件包含**：
   - `dist/` 目录必须存在且包含构建产物
   - `bin/cc-help.js` 必须有执行权限

4. **依赖管理**：
   - 确保 `dependencies` 中的包都是运行时必需的
   - 开发依赖放在 `devDependencies`

## 🐛 常见问题

### Q1: 发布时提示 "You do not have permission to publish"
**解决**：使用作用域包名或更换包名

### Q2: 全局安装后命令找不到
**解决**：
1. 检查 `bin/cc-help.js` 第一行是否有 `#!/usr/bin/env node`
2. 检查 `package.json` 的 `bin` 字段配置

### Q3: npx 运行失败
**解决**：
1. 确保 `prepublishOnly` 脚本已执行
2. 确保 `dist/` 目录已包含在发布文件中

### Q4: 如何撤销发布
```bash
# 只能撤销 72 小时内的版本
npm unpublish cc-help@1.0.0

# 废弃某个版本（推荐）
npm deprecate cc-help@1.0.0 "请升级到最新版本"
```

## 📚 相关命令

```bash
# 查看当前登录用户
npm whoami

# 查看包信息
npm info cc-help

# 查看包的所有版本
npm view cc-help versions

# 查看包的下载统计
npm view cc-help

# 更新包的 README（无需重新发布）
npm publish --dry-run
```

## 🎉 发布成功后

用户可以通过以下方式使用：

```bash
# 全局安装
npm install -g cc-help
cc-help

# 使用 npx（无需安装）
npx cc-help
```

祝发布顺利！🚀
