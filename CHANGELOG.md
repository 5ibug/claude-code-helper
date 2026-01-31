# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-01-31

### Added
- 🌐 **国际化支持 (i18n)** - 添加了完整的英语支持，用户可以在中英文之间自由切换
  - 所有页面和组件都已国际化
  - 在侧边栏添加了语言切换按钮（国旗图标）
  - 语言选择会自动保存到本地存储
- ⚙️ **AI 署名配置** - 在配置管理页面新增 AI 署名相关配置项
  - 支持旧版本的 `includeCoAuthoredBy` 配置（< 2.0.62）
  - 支持新版本的 `attribution.commits` 和 `attribution.pullRequests` 配置（>= 2.0.62）
  - 自动检测 Claude Code 版本并显示相应的配置项
  - 为废弃或未生效的配置项添加了版本提示标签

### Fixed
- 🐛 **版本号显示修复** - 修复了首页环境检查中的版本号显示问题
  - 修复 Node.js 版本号前多余的 `v` 前缀
  - 修复 Git 版本号末尾多余的点号

### Changed
- 📝 **README 优化** - 将 README 分为中英文两个独立文件
  - `README.md` - 中文版
  - `README_EN.md` - 英文版
  - 两个文件之间添加了语言切换链接

## [1.0.0] - 2026-01-30

### Added
- 🎉 初始版本发布
- 🏠 环境检查功能 - 检测 Git、Node、npm、pnpm、Claude 的安装状态和版本
- 🔑 API 配置管理 - 管理多个 Claude API 配置，支持快速切换
- 💬 系统提示词管理 - 自定义和管理系统提示词
- ⚙️ 环境变量管理 - 管理 Claude Code 相关的环境变量
- 📝 配置管理 - 统一管理所有配置项
- 🚀 一键安装功能 - 支持一键安装 Claude Code 和 pnpm
- 🌐 Web 界面 - 提供友好的 Web 管理界面
- 📦 NPM 包发布 - 支持全局安装和 npx 直接运行

[1.0.1]: https://github.com/5ibug/cc-help/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/5ibug/cc-help/releases/tag/v1.0.0
