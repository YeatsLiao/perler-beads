# 想想手作

拼豆创作工具 - 微信小程序 + App

## 项目介绍

想想手作是一款专为拼豆（Fuse Beads / Perler Beads）手工爱好者设计的跨平台创作工具。

### 核心功能

- 📷 **图片智能生成**：上传照片，一键转换为拼豆图纸
- ✏️ **像素画编辑器**：强大的手绘工具，支持画笔、填充、吸管等
- 🎨 **多品牌色板**：支持 Perler、Artkal、HAMA 等主流拼豆品牌
- 📊 **智能统计**：自动计算每种颜色的颗粒数量
- 📤 **高清导出**：PNG、JPG、PDF 多格式导出
- 🏠 **作品广场**：分享创意，交流灵感

## 技术栈

- **前端框架**：uni-app (Vue 3 + TypeScript)
- **后端服务**：微信云开发
- **目标平台**：微信小程序、iOS App、Android App、H5

## 项目文档

- [设计文档](./docs/specs/SPEC.md) - 完整的产品设计和技术方案
- [变更记录](./docs/specs/changelog.md) - 版本历史和重要变更
- [任务清单](./docs/TODO.md) - 开发任务和进度追踪

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8 (推荐) 或 npm >= 9
- HBuilderX 或 VS Code + uni-app 插件

### 安装依赖

```bash
# 安装 pnpm (如果没有)
npm install -g pnpm

# 安装依赖
pnpm install
```

### 运行项目

```bash
# 运行微信小程序
pnpm dev:mp-weixin

# 运行 H5
pnpm dev:h5

# 运行 App
pnpm dev:app
```

### 构建项目

```bash
# 构建微信小程序
pnpm build:mp-weixin

# 构建 H5
pnpm build:h5

# 构建 App
pnpm build:app
```

## 项目结构

```
xiangxiang-crafts/
├── docs/                    # 项目文档
│   ├── specs/              # 设计文档
│   │   ├── SPEC.md        # 主设计文档
│   │   └── changelog.md   # 变更记录
│   └── TODO.md            # 任务清单
├── src/                    # 源代码
│   ├── api/               # API 接口
│   ├── components/        # 公共组件
│   ├── constants/         # 常量（色板数据）
│   ├── pages/             # 页面
│   ├── static/            # 静态资源
│   ├── stores/            # 状态管理
│   ├── styles/            # 全局样式
│   ├── types/             # TypeScript 类型
│   └── utils/             # 工具函数
├── package.json
└── README.md
```

## 开发指南

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint + Prettier 配置
- 组件使用 PascalCase 命名
- 工具函数使用 camelCase 命名

### Git 提交规范

```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具
```

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-05-08 | 初始设计版本 |

## 可参考的开源项目

- [pindou-draw](https://github.com/MXBraisedFish/pindou-draw) - 完整的拼豆绘图工具
- [perler-beads-server](https://github.com/LingNc/perler-beads-server) - Next.js 拼豆应用
- [fast-pixelizer](https://www.npmjs.com/package/fast-pixelizer) - 像素化算法库

## 许可证

MIT License

## 联系方式

- 项目主页：想想手作
- 微信公众号：想想手作店

---

*让创意落地，让拼豆创作更简单*
