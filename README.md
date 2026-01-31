# Claude Code Helper (cc-help)

[English](./README_EN.md) | 中文

轻量化 CLI 工具，帮助安装和配置 Claude Code。

### 功能特性

- 🏠 **环境检查** - 检测系统中的开发工具（Git、Node、NPM、PNPM、Claude）
- 🔑 **API 管理** - 管理多个 Claude API 配置，支持快速切换
- 💬 **系统提示词管理** - 自定义和管理系统提示词
- ⚙️ **环境变量管理** - 管理 Claude Code 相关的环境变量
- 📝 **配置管理** - 统一管理所有配置项

### 安装

#### 全局安装

```bash
npm install -g cc-help
```

#### 使用 npx（无需安装）

```bash
npx cc-help
```

### 使用方法

安装后，直接运行命令：

```bash
cc-help
```

或使用 npx：

```bash
npx cc-help
```

程序会自动启动 Web 界面，并在浏览器中打开管理面板。

### 系统要求

- Node.js >= 18.0.0
- Windows / macOS / Linux

### 配置文件位置

- API 配置：`~/.claude/api-configs.json`
- Settings：`~/.claude/settings.json`
- 数据库：项目根目录 `data.db`

### 开发

```bash
# 克隆仓库
git clone https://github.com/5ibug/claude-code-helper.git
cd cc-help

# 安装依赖
npm install

# 构建前端
npm run build

# 启动
npm start
```

### 许可证

MIT

### 贡献

欢迎提交 Issue 和 Pull Request！
