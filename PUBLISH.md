# NPM 发布指南

## 发布前检查清单

### 1. 构建前端资源
```bash
npm run build
```
确保 `dist/` 目录生成成功，包含：
- `index.html`
- `assets/` 目录（包含 JS 和 CSS 文件）

### 2. 测试本地安装
```bash
# 在项目根目录执行
npm link

# 测试命令
cc-help

# 测试完成后取消链接
npm unlink -g cc-help
```

### 3. 更新版本号
```bash
# 补丁版本（bug 修复）
npm version patch

# 次版本（新功能）
npm version minor

# 主版本（破坏性更新）
npm version major
```

### 4. 登录 npm
```bash
npm login
```

### 5. 发布到 npm
```bash
# 首次发布
npm publish

# 如果包名被占用，可以使用作用域
npm publish --access public
```

### 6. 测试安装
```bash
# 全局安装测试
npm install -g cc-help

# 运行测试
cc-help

# 使用 npx 测试
npx cc-help
```

## 更新发布流程

1. 修改代码
2. 运行 `npm run build` 构建前端
3. 测试功能是否正常
4. 更新版本号 `npm version patch/minor/major`
5. 发布 `npm publish`

## 注意事项

1. **首次发布前**：
   - 确保 package.json 中的 `name` 在 npm 上未被占用
   - 如果被占用，可以改名或使用作用域包名（如 `@yourname/cc-help`）

2. **版本管理**：
   - 遵循语义化版本规范（Semantic Versioning）
   - 主版本号.次版本号.修订号（如 1.2.3）

3. **文件包含**：
   - `files` 字段指定了要发布的文件
   - `.npmignore` 排除了不需要的文件
   - 确保 `dist/` 目录被包含

4. **依赖管理**：
   - `dependencies` 是运行时依赖，会被安装
   - `devDependencies` 是开发依赖，不会被安装

## 常见问题

### Q: 如何撤销已发布的版本？
```bash
npm unpublish cc-help@1.0.0
```
注意：只能撤销 72 小时内发布的版本

### Q: 如何废弃某个版本？
```bash
npm deprecate cc-help@1.0.0 "此版本有严重 bug，请升级到 1.0.1"
```

### Q: 如何查看包信息？
```bash
npm info cc-help
```

### Q: 发布失败怎么办？
- 检查是否登录：`npm whoami`
- 检查包名是否可用：`npm search cc-help`
- 检查网络连接
- 查看错误信息并根据提示修复
