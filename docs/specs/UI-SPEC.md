# 想想手作 - UI设计规范

## 一、设计理念

### 1.1 风格定位

**核心关键词**：手工感、温暖、活泼、像素风、亲和力

**设计原则**：
- **手工质感**：营造真实手工创作的温暖氛围
- **像素美学**：呼应拼豆的像素化本质，保持视觉一致性
- **简洁清爽**：避免复杂装饰，突出创作内容
- **色彩丰富**：使用柔和的配色，避免刺眼的对比
- **亲和力强**：圆润的边角、柔和的阴影、友好的交互反馈

**灵感来源**：
- 真实拼豆的颗粒感和色彩丰富性
- 手工工作室的温暖氛围
- 像素艺术的复古美学

---

## 二、色彩系统

### 2.1 主色调

| 颜色 | 色值 | 用途 | 说明 |
|------|------|------|------|
| 主色 | `#FF8C69` | 品牌色、按钮、强调 | 温暖的珊瑚橙，充满手工感 |
| 主色浅 | `#FFF0EB` | 背景、卡片 | 柔和的暖粉色调 |
| 主色深 | `#E57555` | 悬停、选中状态 | 加深的珊瑚橙 |

### 2.2 辅助色

| 颜色 | 色值 | 用途 | 说明 |
|------|------|------|------|
| 成功 | `#7CB77C` | 成功提示、完成状态 | 清新的薄荷绿 |
| 警告 | `#FFD384` | 警告提示、注意事项 | 温暖的奶油黄 |
| 错误 | `#FF7575` | 错误提示、删除操作 | 柔和的珊瑚红 |
| 信息 | `#7AB8FF` | 信息提示、链接 | 清爽的天空蓝 |

### 2.3 中性色

| 颜色 | 色值 | 用途 | 说明 |
|------|------|------|------|
| 背景 | `#FFF8F0` | 页面背景 | 温暖的奶油底色 |
| 卡片 | `#FFFFFF` | 卡片、弹窗 | 纯白背景 |
| 边框 | `#FFE8D9` | 分隔线、边框 | 温暖的浅橙色 |
| 文本主 | `#4A3728` | 正文、标题 | 深棕色，温暖舒适 |
| 文本次 | `#8B7355` | 辅助文字 | 中等棕色 |
| 文本弱 | `#C4B5A0` | 占位符、提示 | 浅棕色 |

### 2.4 拼豆糖果色系

从真实拼豆色板中提取的温暖糖果色，用于装饰和营造手工氛围：

| 颜色 | 色值 | 名称 | 用途 |
|------|------|------|------|
| 奶油白 | `#FFF8E7` | Cream | 背景、高亮 |
| 蜜桃粉 | `#FFB7C5` | Peach Pink | 装饰、强调 |
| 天空蓝 | `#A8D8EA` | Sky Blue | 装饰、图标 |
| 薄荷绿 | `#B8E0D2` | Mint | 成功、装饰 |
| 奶油黄 | `#FFE4B5` | Cream Yellow | 警告、装饰 |
| 薰衣草紫 | `#E6D5E7` | Lavender | 装饰、特殊标记 |
| 蜜桃橙 | `#FFCBA4` | Peach Orange | 装饰、高亮 |
| 樱花粉 | `#FFD6E0` | Sakura Pink | 装饰、温馨元素 |
| 薄荷蓝 | `#B2DFDB` | Mint Blue | 信息、装饰 |
| 柠檬黄 | `#FFF3B0` | Lemon | 强调、装饰 |

### 2.5 品牌渐变色

| 渐变名称 | 起始色 | 结束色 | 用途 |
|----------|--------|--------|------|
| 主渐变 | `#FF8C69` | `#FFB7C5` | 按钮、Banner |
| 温暖渐变 | `#FFE4B5` | `#FFCBA4` | 背景装饰 |
| 清新渐变 | `#B8E0D2` | `#A8D8EA` | 成功状态 |

---

## 三、字体规范

### 3.1 字体选择

| 平台 | 中文字体 | 英文字体 |
|------|----------|----------|
| 微信小程序 | 苹方 / 思源黑体 | Helvetica / Arial |
| iOS | PingFang SC | SF Pro Display |
| Android | 思源黑体 | Roboto |
| H5 | 思源黑体 | Arial |

### 3.2 字号规范

| 用途 | 字号 | 字重 | 行高 |
|------|------|------|------|
| 页面标题 | 32rpx | 600 | 1.4 |
| 卡片标题 | 28rpx | 500 | 1.4 |
| 正文 | 28rpx | 400 | 1.5 |
| 辅助文字 | 24rpx | 400 | 1.4 |
| 小字/标签 | 22rpx | 400 | 1.4 |
| 按钮文字 | 28rpx | 500 | 1.4 |

### 3.3 字体样式

```css
/* 页面标题 */
.title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  line-height: 1.4;
}

/* 正文 */
.text {
  font-size: 28rpx;
  font-weight: 400;
  color: #333333;
  line-height: 1.5;
}

/* 辅助文字 */
.text-secondary {
  font-size: 24rpx;
  font-weight: 400;
  color: #666666;
  line-height: 1.4;
}
```

---

## 四、图标设计规范

### 4.1 图标风格

**核心风格**：像素风格 + 圆润感

**设计要点**：
- 采用像素化设计，但边缘柔和
- 使用清晰的几何形状
- 保持24x24或48x48的标准尺寸
- 颜色使用主色调或中性色

### 4.2 图标分类

| 分类 | 图标示例 | 用途 |
|------|----------|------|
| 工具类 | 画笔、橡皮擦、填充、吸管 | 编辑器工具栏 |
| 操作类 | 保存、导出、分享、收藏 | 功能按钮 |
| 导航类 | 首页、创作、作品、个人中心 | TabBar |
| 状态类 | 成功、失败、警告、加载 | 提示反馈 |

### 4.3 图标设计示例

```svg
<!-- 画笔图标 - 像素风格 -->
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect x="20" y="8" width="8" height="8" fill="#FF6B6B"/>
  <rect x="20" y="16" width="8" height="8" fill="#FF6B6B"/>
  <rect x="16" y="24" width="16" height="8" fill="#FF6B6B"/>
  <rect x="12" y="32" width="24" height="8" fill="#FF6B6B"/>
  <rect x="16" y="40" width="16" height="8" fill="#333333"/>
</svg>

<!-- 调色盘图标 -->
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <circle cx="24" cy="24" r="20" fill="#FFFFFF" stroke="#E8E8E8" stroke-width="2"/>
  <circle cx="16" cy="20" r="6" fill="#FF6B6B"/>
  <circle cx="32" cy="18" r="5" fill="#1890FF"/>
  <circle cx="20" cy="32" r="5" fill="#52C41A"/>
  <circle cx="32" cy="30" r="4" fill="#FAAD14"/>
</svg>
```

---

## 五、组件设计规范

### 5.1 按钮组件

#### 5.1.1 基础按钮

| 类型 | 样式 | 用途 |
|------|------|------|
| 主要按钮 | 主色填充 + 白色文字 | 主要操作 |
| 次要按钮 | 白色背景 + 主色边框 | 次要操作 |
| 文字按钮 | 纯文字，无边框 | 辅助操作 |

```css
/* 主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, #FF6B6B 0%, #E55555 100%);
  color: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx 48rpx;
  font-size: 28rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(255, 107, 107, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 6rpx rgba(255, 107, 107, 0.2);
}

/* 次要按钮 */
.btn-secondary {
  background: #FFFFFF;
  color: #FF6B6B;
  border: 2rpx solid #FF6B6B;
  border-radius: 16rpx;
  padding: 24rpx 48rpx;
  font-size: 28rpx;
  font-weight: 500;
}

/* 文字按钮 */
.btn-text {
  background: transparent;
  color: #666666;
  padding: 16rpx 24rpx;
  font-size: 26rpx;
}
```

### 5.2 卡片组件

```css
.card {
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 24rpx;
  margin: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.card-title {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
}

.card-body {
  font-size: 26rpx;
  color: #666666;
  line-height: 1.5;
}
```

### 5.3 输入框组件

```css
.input-wrapper {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  border: 2rpx solid #E8E8E8;
  transition: all 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #FF6B6B;
  box-shadow: 0 0 0 4rpx rgba(255, 107, 107, 0.1);
}

.input {
  width: 100%;
  font-size: 28rpx;
  color: #333333;
  background: transparent;
}

.input-placeholder {
  color: #999999;
}
```

### 5.4 开关组件

```css
.switch {
  width: 80rpx;
  height: 44rpx;
  background: #E8E8E8;
  border-radius: 22rpx;
  position: relative;
  transition: background 0.2s ease;
}

.switch.active {
  background: #FF6B6B;
}

.switch-thumb {
  width: 36rpx;
  height: 36rpx;
  background: #FFFFFF;
  border-radius: 50%;
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.switch.active .switch-thumb {
  transform: translateX(36rpx);
}
```

---

## 六、布局规范

### 6.1 页面布局

```
┌─────────────────────────────────────────────────────────────┐
│  顶部导航栏 (固定)                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 返回按钮 │ 页面标题 │ 右侧操作按钮                   │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  内容区域 (可滚动)                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │     页面内容...                                     │   │
│  │                                                    │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  底部 TabBar (固定)                                         │
│  ┌──────────┬──────────┬──────────┬──────────┐            │
│  │  首页    │  创作    │  作品    │  我的    │            │
│  └──────────┴──────────┴──────────┴──────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 间距规范

| 间距名称 | 尺寸 | 用途 |
|----------|------|------|
| 页面边距 | 24rpx | 页面内容与屏幕边缘 |
| 卡片间距 | 16rpx | 卡片之间的间隔 |
| 内容间距 | 16rpx | 内容元素之间 |
| 内边距 | 24rpx | 容器内部填充 |
| 文字行距 | 1.5 | 正文行高 |

### 6.3 圆角规范

| 元素 | 圆角大小 | 说明 |
|------|----------|------|
| 卡片 | 20rpx | 中等圆角 |
| 按钮 | 16rpx | 圆润但不过分 |
| 输入框 | 16rpx | 柔和的边角 |
| 图片 | 12rpx | 轻微圆角 |
| 圆形按钮 | 50% | 完全圆形 |

---

## 七、动效规范

### 7.1 基础动效

| 动效类型 | 持续时间 | 缓动函数 | 用途 |
|----------|----------|----------|------|
| 淡入 | 300ms | ease-out | 页面切换、元素出现 |
| 滑入 | 300ms | ease-out | 弹窗、菜单 |
| 缩放 | 200ms | ease-out | 按钮点击、状态切换 |
| 渐隐 | 200ms | ease-in | 元素消失 |

### 7.2 交互反馈

| 交互 | 反馈效果 |
|------|----------|
| 按钮点击 | 缩放 0.98 + 阴影变化 |
| 列表项点击 | 背景高亮 + 轻微缩放 |
| 加载状态 | 旋转动画 + 占位符 |
| 成功操作 | 绿色勾选动画 |
| 失败操作 | 红色抖动提示 |

### 7.3 动画示例

```css
/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* 按钮点击效果 */
.btn:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* 加载动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading {
  animation: spin 1s linear infinite;
}
```

---

## 八、页面设计规范

### 8.1 首页（作品广场）

**设计要点**：
- 顶部 Banner 轮播
- 分类入口网格（大图标 + 文字）
- 瀑布流作品列表
- 底部 TabBar 导航

**视觉特点**：
- 温暖的渐变背景
- 卡片圆角 20rpx
- 作品图片圆角 12rpx
- 标签使用圆角胶囊样式

### 8.2 创作中心

**设计要点**：
- 创建方式选择（图片生成 / 手绘）
- 大卡片展示，直观易懂
- 图标 + 标题 + 简短描述

**视觉特点**：
- 卡片悬浮阴影
- 渐变色背景装饰
- 图标尺寸 120x120

### 8.3 编辑器页面

**设计要点**：
- 顶部工具栏（工具选择）
- 中间画布区域（可缩放）
- 底部色板选择器
- 颜色统计面板

**视觉特点**：
- 深色工具栏背景（减少视觉干扰）
- 色板圆形展示
- 当前颜色高亮指示

### 8.4 导出页面

**设计要点**：
- 导出预览区域
- 格式选择（PNG/JPG/PDF）
- 选项开关（网格、色号、镜像）
- 导出按钮

**视觉特点**：
- 预览区域有边框和阴影
- 选项卡片式布局
- 主色按钮突出

---

## 九、特殊设计元素

### 9.1 像素装饰

在页面适当位置添加小的像素化装饰元素，增强手工氛围：

```svg
<!-- 像素星星 -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
  <rect x="12" y="2" width="4" height="4" fill="#FFD700"/>
  <rect x="12" y="18" width="4" height="4" fill="#FFD700"/>
  <rect x="2" y="12" width="4" height="4" fill="#FFD700"/>
  <rect x="18" y="12" width="4" height="4" fill="#FFD700"/>
  <rect x="6" y="6" width="4" height="4" fill="#FFD700"/>
  <rect x="14" y="6" width="4" height="4" fill="#FFD700"/>
  <rect x="6" y="14" width="4" height="4" fill="#FFD700"/>
  <rect x="14" y="14" width="4" height="4" fill="#FFD700"/>
</svg>
```

### 9.2 拼豆纹理背景

使用细微的拼豆颗粒纹理作为背景，增加手工质感：

```css
.bead-pattern {
  background-image: 
    radial-gradient(circle, #E8E8E8 1px, transparent 1px);
  background-size: 20rpx 20rpx;
}
```

---

## 十、设计资源

### 10.1 图标库

- **推荐图标库**：
  - uni-icons（uni-app 内置）
  - IconFont（阿里巴巴矢量图标库）
  - 自定义像素风格图标

### 10.2 设计工具

- **UI设计**：Figma / Sketch
- **图标设计**：Figma / Illustrator
- **色彩工具**：Coolors / Adobe Color

### 10.3 设计文件结构

```
design/
├── components/          # 组件设计
│   ├── Button.fig
│   ├── Card.fig
│   ├── Input.fig
│   └── ...
├── pages/               # 页面设计
│   ├── Home.fig
│   ├── Create.fig
│   ├── Editor.fig
│   └── ...
├── assets/              # 资源文件
│   ├── icons/          # 图标
│   ├── colors/         # 配色方案
│   └── patterns/       # 纹理图案
└── style-guide.fig      # 设计规范
```

---

## 十一、规范检查清单

### 11.1 视觉规范检查

- [ ] 颜色使用是否符合配色系统
- [ ] 字体大小是否符合规范
- [ ] 圆角是否统一
- [ ] 间距是否一致
- [ ] 图标风格是否统一

### 11.2 交互规范检查

- [ ] 按钮点击有反馈
- [ ] 加载状态有提示
- [ ] 错误状态有提示
- [ ] 动画流畅不卡顿
- [ ] 触摸目标足够大（≥44x44rpx）

### 11.3 响应式检查

- [ ] 在不同屏幕尺寸下布局正常
- [ ] 文字不重叠、不被截断
- [ ] 按钮和可点击元素大小合适

---

## 附录：设计模板代码

### uni-app 样式变量

```scss
// 主色调变量
$color-primary: #FF8C69;
$color-primary-light: #FFF0EB;
$color-primary-dark: #E57555;
$color-success: #7CB77C;
$color-warning: #FFD384;
$color-error: #FF7575;
$color-info: #7AB8FF;

// 中性色变量
$color-bg: #FFF8F0;
$color-card: #FFFFFF;
$color-border: #FFE8D9;
$color-text: #4A3728;
$color-text-secondary: #8B7355;
$color-text-weak: #C4B5A0;

// 拼豆糖果色系
$color-cream: #FFF8E7;
$color-peach-pink: #FFB7C5;
$color-sky-blue: #A8D8EA;
$color-mint: #B8E0D2;
$color-cream-yellow: #FFE4B5;
$color-lavender: #E6D5E7;
$color-peach-orange: #FFCBA4;
$color-sakura-pink: #FFD6E0;
$color-mint-blue: #B2DFDB;
$color-lemon: #FFF3B0;

// 字体变量
$font-size-title: 32rpx;
$font-size-heading: 28rpx;
$font-size-body: 28rpx;
$font-size-secondary: 24rpx;
$font-size-small: 22rpx;

// 间距变量
$spacing-page: 24rpx;
$spacing-card: 16rpx;
$spacing-content: 16rpx;
$spacing-padding: 24rpx;

// 圆角变量
$radius-card: 20rpx;
$radius-button: 16rpx;
$radius-input: 16rpx;
$radius-image: 12rpx;
$radius-circle: 50%;

// 阴影变量
$shadow-card: 0 4rpx 16rpx rgba(255, 140, 105, 0.08);
$shadow-button: 0 6rpx 20rpx rgba(255, 140, 105, 0.25);
$shadow-float: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);

// 渐变变量
$gradient-primary: linear-gradient(135deg, #FF8C69 0%, #FFB7C5 100%);
$gradient-warm: linear-gradient(135deg, #FFE4B5 0%, #FFCBA4 100%);
$gradient-fresh: linear-gradient(135deg, #B8E0D2 0%, #A8D8EA 100%);
```

---

*文档版本：v1.0*  
*创建日期：2026-05-08*  
*适用项目：想想手作*
