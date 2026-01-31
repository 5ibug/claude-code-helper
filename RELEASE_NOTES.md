# Release Notes - v1.0.1

## 🎉 What's New

### 🌐 Internationalization (i18n)
- Added full English language support
- Language switcher with flag icons in the sidebar
- All pages and components are now fully internationalized
- Language preference is automatically saved

### ⚙️ AI Attribution Configuration
- New AI attribution settings in Configuration Management
- Automatic version detection for Claude Code
- Support for both legacy (`includeCoAuthoredBy`) and new (`attribution.*`) configurations
- Version-specific warnings for deprecated or unavailable features:
  - **< 2.0.62**: Shows "Requires version >= 2.0.62" for new attribution settings
  - **>= 2.0.62**: Shows "Deprecated in version 2.0.62" for legacy settings

### 🐛 Bug Fixes
- Fixed Node.js version display (removed extra "v" prefix)
- Fixed Git version display (removed trailing dot)

### 📝 Documentation
- Split README into separate Chinese and English files
- Added language navigation links between README files

## 📦 Installation

### Global Installation
```bash
npm install -g cc-help
```

### Using npx (No Installation Required)
```bash
npx cc-help
```

## 🔗 Links
- [Full Changelog](CHANGELOG.md)
- [Documentation](README.md)
- [English Documentation](README_EN.md)

## 🙏 Feedback
If you encounter any issues or have suggestions, please [open an issue](https://github.com/5ibug/cc-help/issues).
