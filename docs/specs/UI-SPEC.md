# 想想手作 - 设计系统规范 v2.0

## 一、设计理念

### 1.1 风格定位

**核心关键词**：手工感、温暖、活泼、像素风、亲和力

**设计原则**：
- **手工质感**：营造真实手工创作的温暖氛围
- **像素美学**：呼应拼豆的像素化本质，保持视觉一致性
- **简洁清爽**：避免复杂装饰，突出创作内容
- **色彩丰富**：使用柔和的配色，避免刺眼的对比
- **亲和力强**：圆润的边角、柔和的阴影、友好的交互反馈

---

## 二、设计Token体系

### 2.1 色彩系统

#### 主色调

| Token | 色值 | 用途 |
|-------|------|------|
| `$color-primary` | `#FF7A59` | 品牌色、按钮、强调 |
| `$color-primary-light` | `#FFF0EB` | 背景、卡片 |
| `$color-primary-dark` | `#D85F44` | 悬停、选中 |
| `$color-primary-lighter` | `#FFF8F5` | 极浅背景 |
| `$color-primary-darker` | `#B8472F` | 深强调 |

#### 语义色（含色阶）

| Token | 色值 | 用途 |
|-------|------|------|
| `$color-success` / `-light` / `-dark` | `#7CB77C` / `#F0F9F0` / `#5A9A5A` | 成功提示 |
| `$color-warning` / `-light` / `-dark` | `#FFD384` / `#FFF9EC` / `#E5B85E` | 警告提示 |
| `$color-error` / `-light` / `-dark` | `#FF7575` / `#FFF0F0` / `#E04E4E` | 错误提示 |
| `$color-info` / `-light` / `-dark` | `#7AB8FF` / `#F0F7FF` / `#4A96E0` | 信息提示 |

#### 中性色

| Token | 色值 | 用途 |
|-------|------|------|
| `$color-bg` | `#FFF8F0` | 页面背景 |
| `$color-bg-soft` | `#FFFDF9` | 柔和背景 |
| `$color-bg-deep` | `#FFF0E0` | 深层背景 |
| `$color-card` | `#FFFFFF` | 卡片背景 |
| `$color-border` | `#FFE8D9` | 边框 |
| `$color-border-light` | `#FFF0E8` | 浅边框 |
| `$color-divider` | `#FFE0CC` | 分割线 |
| `$color-text` | `#4A3728` | 正文 |
| `$color-text-secondary` | `#8B7355` | 辅助文字 |
| `$color-text-weak` | `#C4B5A0` | 占位符 |
| `$color-text-placeholder` | `#D4C8B8` | 输入占位 |
| `$color-text-inverse` | `#FFFFFF` | 反色文字 |

#### 拼豆糖果色系

| Token | 色值 | 名称 |
|-------|------|------|
| `$color-cream` | `#FFF8E7` | 奶油白 |
| `$color-peach-pink` | `#FFB7C5` | 蜜桃粉 |
| `$color-sky-blue` | `#A8D8EA` | 天空蓝 |
| `$color-mint` | `#B8E0D2` | 薄荷绿 |
| `$color-cream-yellow` | `#FFE4B5` | 奶油黄 |
| `$color-lavender` | `#E6D5E7` | 薰衣草紫 |
| `$color-peach-orange` | `#FFCBA4` | 蜜桃橙 |
| `$color-sakura-pink` | `#FFD6E0` | 樱花粉 |
| `$color-mint-blue` | `#B2DFDB` | 薄荷蓝 |
| `$color-lemon` | `#FFF3B0` | 柠檬黄 |

#### 遮罩色

| Token | 色值 | 用途 |
|-------|------|------|
| `$color-overlay` | `rgba(74,55,40,0.5)` | 弹窗遮罩 |
| `$color-mask` | `rgba(74,55,40,0.7)` | 深遮罩 |

#### 渐变色

| Token | 值 | 用途 |
|-------|----|------|
| `$gradient-primary` | `135deg, #FF7A59 → #FFB7C5` | 按钮、Banner |
| `$gradient-warm` | `135deg, #FFF3B0 → #FFCBA4` | 背景装饰 |
| `$gradient-fresh` | `135deg, #B8E0D2 → #A8D8EA` | 成功状态 |
| `$gradient-ink` | `135deg, #4A3728 → #8B7355` | 深色装饰 |
| `$gradient-sunset` | `135deg, #FF7A59 → #FFD384` | 日落渐变 |
| `$gradient-sakura` | `135deg, #FFB7C5 → #E6D5E7` | 樱花渐变 |

### 2.2 字体规范

| Token | 值 | 用途 |
|-------|----|------|
| `$font-size-display` | `40rpx` | 大标题 |
| `$font-size-title` | `32rpx` | 页面标题 |
| `$font-size-heading` | `28rpx` | 卡片标题/按钮 |
| `$font-size-body` | `28rpx` | 正文 |
| `$font-size-secondary` | `24rpx` | 辅助文字 |
| `$font-size-small` | `22rpx` | 小字/标签 |
| `$font-size-tiny` | `20rpx` | 极小文字 |

| Token | 值 | 用途 |
|-------|----|------|
| `$font-weight-regular` | `400` | 正文 |
| `$font-weight-medium` | `500` | 标题/按钮 |
| `$font-weight-semibold` | `600` | 强调标题 |
| `$font-weight-bold` | `700` | 大标题 |

| Token | 值 | 用途 |
|-------|----|------|
| `$line-height-tight` | `1.2` | 标题 |
| `$line-height-normal` | `1.5` | 正文 |
| `$line-height-relaxed` | `1.75` | 长文本 |

### 2.3 间距刻度

| Token | 值 | 用途 |
|-------|----|------|
| `$spacing-0` | `0` | 无间距 |
| `$spacing-xs` | `4rpx` | 极小间距 |
| `$spacing-sm` | `8rpx` | 小间距 |
| `$spacing-md` | `16rpx` | 中间距 |
| `$spacing-lg` | `24rpx` | 大间距 |
| `$spacing-xl` | `32rpx` | 超大间距 |
| `$spacing-2xl` | `48rpx` | 特大间距 |
| `$spacing-3xl` | `64rpx` | 巨大间距 |

### 2.4 圆角规范

| Token | 值 | 用途 |
|-------|----|------|
| `$radius-none` | `0` | 直角 |
| `$radius-xs` | `4rpx` | 微圆角 |
| `$radius-sm` | `8rpx` | 小圆角 |
| `$radius-md` | `12rpx` | 中圆角 |
| `$radius-lg` | `16rpx` | 大圆角 |
| `$radius-xl` | `20rpx` | 超大圆角 |
| `$radius-2xl` | `28rpx` | 特大圆角 |
| `$radius-circle` | `50%` | 圆形 |

### 2.5 阴影规范

| Token | 值 | 用途 |
|-------|----|------|
| `$shadow-none` | `none` | 无阴影 |
| `$shadow-sm` | `0 2rpx 8rpx rgba(126,76,48,0.04)` | 微阴影 |
| `$shadow-card` | `0 10rpx 28rpx rgba(126,76,48,0.08)` | 卡片 |
| `$shadow-button` | `0 12rpx 24rpx rgba(255,122,89,0.26)` | 按钮 |
| `$shadow-float` | `0 18rpx 42rpx rgba(126,76,48,0.12)` | 浮层 |
| `$shadow-modal` | `0 24rpx 60rpx rgba(126,76,48,0.18)` | 弹窗 |

### 2.6 层级规范

| Token | 值 | 用途 |
|-------|----|------|
| `$z-index-base` | `1` | 基础 |
| `$z-index-sticky` | `10` | 粘性定位 |
| `$z-index-fixed` | `100` | 固定定位 |
| `$z-index-overlay` | `1000` | 遮罩 |
| `$z-index-modal` | `1100` | 弹窗 |
| `$z-index-popover` | `1200` | 弹出层 |
| `$z-index-toast` | `1300` | 提示 |

### 2.7 过渡与动画

| Token | 值 | 用途 |
|-------|----|------|
| `$transition-fast` | `0.15s ease` | 快速过渡 |
| `$transition-normal` | `0.25s ease` | 标准过渡 |
| `$transition-slow` | `0.35s ease` | 慢速过渡 |
| `$transition-spring` | `0.5s cubic-bezier(0.34,1.56,0.64,1)` | 弹性动画 |

### 2.8 其他

| Token | 值 | 用途 |
|-------|----|------|
| `$touch-target-min` | `44rpx` | 最小触摸目标 |
| `$scrollbar-width` | `6rpx` | 滚动条宽度 |

---

## 三、组件库

### 3.1 组件清单

| 组件 | 文件 | 说明 |
|------|------|------|
| Button | `Button.vue` | 主/次/文字按钮，支持disabled |
| Card | `Card.vue` | 卡片容器，支持hoverable |
| NavBar | `NavBar.vue` | 顶部导航栏 |
| TabBar | `TabBar.vue` | 底部TabBar |
| PixelPreview | `PixelPreview.vue` | 像素预览 |
| Input | `Input.vue` | 输入框，支持prefix/suffix/clearable/error |
| Switch | `Switch.vue` | 开关，支持activeColor/disabled |
| Tag | `Tag.vue` | 标签，5种语义×3种尺寸，支持round |
| Badge | `Badge.vue` | 徽标，支持数字/圆点/max溢出 |
| Modal | `Modal.vue` | 弹窗，支持title/content/双按钮/遮罩关闭 |
| Toast | `Toast.vue` | 轻提示，5种类型×3种位置，支持duration |
| Empty | `Empty.vue` | 空状态，4种类型，支持自定义icon/action |
| Loading | `Loading.vue` | 加载，spinner/circle/dots三种样式 |
| Avatar | `Avatar.vue` | 头像，图片/文字，3种尺寸，自动配色 |
| Divider | `Divider.vue` | 分割线，水平/垂直，支持文字分割 |
| Cell | `Cell.vue` | 列表单元格，支持icon/value/isLink/clickable |
| Overlay | `Overlay.vue` | 遮罩层，支持slot/closable/zIndex |

### 3.2 组件设计规范

#### Button 按钮

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | `'primary'\|'secondary'\|'text'` | `'primary'` | 按钮类型 |
| disabled | `boolean` | `false` | 禁用状态 |

- **primary**: 渐变背景 + 白色文字 + 按钮阴影
- **secondary**: 白色背景 + 主色边框 + 主色文字
- **text**: 透明背景 + 辅助色文字
- **交互**: `:active` 缩放0.98，禁用态opacity 0.5

#### Input 输入框

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `string` | `''` | 双向绑定 |
| type | `string` | `'text'` | 输入类型 |
| placeholder | `string` | `''` | 占位文本 |
| disabled | `boolean` | `false` | 禁用 |
| clearable | `boolean` | `false` | 可清除 |
| error | `boolean` | `false` | 错误状态 |
| errorMessage | `string` | `''` | 错误提示 |

- **聚焦**: 主色边框 + 主色光晕
- **错误**: 错误色边框 + 错误色光晕 + 底部错误文字
- **插槽**: `prefix`（前缀图标）、`suffix`（后缀内容）

#### Switch 开关

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 双向绑定 |
| disabled | `boolean` | `false` | 禁用 |
| activeColor | `string` | `''` | 激活颜色 |

- **尺寸**: 80×44rpx，滑块36×36rpx
- **过渡**: 0.25s ease

#### Tag 标签

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | `'default'\|'primary'\|'success'\|'warning'\|'error'\|'info'` | `'default'` | 类型 |
| size | `'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| round | `boolean` | `false` | 胶囊样式 |

#### Badge 徽标

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| content | `string\|number` | `''` | 内容 |
| max | `number` | `99` | 最大值溢出 |
| dot | `boolean` | `false` | 圆点模式 |
| type | `'primary'\|'success'\|'warning'\|'error'\|'info'` | `'primary'` | 颜色 |

#### Modal 弹窗

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 显示控制 |
| title | `string` | `''` | 标题 |
| content | `string` | `''` | 内容 |
| type | `'primary'\|'success'\|'warning'\|'error'` | `'primary'` | 确认按钮类型 |
| closable | `boolean` | `true` | 可关闭 |
| maskClosable | `boolean` | `true` | 遮罩可关闭 |
| showCancel | `boolean` | `true` | 显示取消 |
| confirmText | `string` | `'确定'` | 确认文字 |
| cancelText | `string` | `'取消'` | 取消文字 |

- **动画**: 遮罩淡入 + 内容缩放淡入

#### Toast 轻提示

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| message | `string` | `''` | 提示文字 |
| type | `'success'\|'error'\|'warning'\|'info'\|'loading'` | `'info'` | 类型 |
| duration | `number` | `2000` | 持续时间(ms) |
| position | `'top'\|'center'\|'bottom'` | `'center'` | 位置 |

- **暴露方法**: `show(msg?, dur?)`, `hide()`

#### Empty 空状态

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | `'暂无数据'` | 标题 |
| description | `string` | `''` | 描述 |
| type | `'default'\|'search'\|'network'\|'permission'` | `'default'` | 类型 |

- **插槽**: `icon`（自定义图标）、`action`（操作按钮）

#### Loading 加载

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | `'spinner'\|'circle'\|'dots'` | `'spinner'` | 样式 |
| text | `string` | `''` | 加载文字 |

#### Avatar 头像

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | `string` | `''` | 图片地址 |
| text | `string` | `''` | 文字(取首字) |
| size | `'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| round | `boolean` | `true` | 圆形 |

- **自动配色**: 无图片时根据文字hash从糖果色系选色

#### Divider 分割线

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| text | `string` | `''` | 分割文字 |
| direction | `'horizontal'\|'vertical'` | `'horizontal'` | 方向 |

#### Cell 列表单元格

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | `string` | `''` | 标题 |
| value | `string` | `''` | 右侧值 |
| label | `string` | `''` | 描述 |
| icon | `string` | `''` | 图标 |
| isLink | `boolean` | `false` | 箭头 |
| clickable | `boolean` | `false` | 可点击 |
| disabled | `boolean` | `false` | 禁用 |

#### Overlay 遮罩层

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | `boolean` | `false` | 显示控制 |
| zIndex | `number` | `1000` | 层级 |
| closable | `boolean` | `true` | 点击关闭 |

---

## 四、全局工具类

### 4.1 文字

- **颜色**: `.text-primary` `.text-secondary` `.text-weak` `.text-success` `.text-warning` `.text-error` `.text-info` `.text-inverse`
- **排版**: `.text-display` `.text-title` `.text-heading` `.text-body` `.text-small` `.text-tiny`
- **对齐**: `.text-center` `.text-left` `.text-right`
- **截断**: `.text-ellipsis` `.text-clamp-2`

### 4.2 Flex布局

- **容器**: `.flex` `.flex-center` `.flex-between` `.flex-around` `.flex-start` `.flex-end` `.flex-col` `.flex-col-center` `.flex-wrap`
- **子项**: `.flex-1` `.flex-shrink-0` `.items-start` `.items-center` `.items-end` `.items-stretch` `.justify-center` `.justify-between` `.justify-around`
- **间距**: `.gap-xs` `.gap-sm` `.gap-md` `.gap-lg` `.gap-xl`

### 4.3 间距

- **margin**: `.m-0` `.mt-xs/sm/md/lg/xl/2xl` `.mb-xs/sm/md/lg/xl/2xl` `.ml-sm/md` `.mr-sm/md`
- **padding**: `.p-0` `.p-xs/sm/md/lg/xl` `.px-lg` `.py-md` `.py-lg`

### 4.4 尺寸与定位

- `.w-full` `.h-full` `.min-h-screen`
- `.overflow-hidden` `.overflow-auto`
- `.relative` `.absolute` `.fixed` `.sticky`

### 4.5 圆角与阴影

- **圆角**: `.rounded-none/sm/md/lg/xl/2xl/circle`
- **阴影**: `.shadow-none` `.shadow-sm` `.shadow-card` `.shadow-float`

### 4.6 背景与边框

- `.bg-primary` `.bg-primary-light` `.bg-card` `.bg-bg` `.bg-cream` `.bg-overlay`
- `.border` `.border-bottom` `.border-top`

### 4.7 安全区域

- `.safe-bottom` `.safe-top`

---

## 五、动画系统

### 5.1 关键帧动画

| 类名 | 动画 | 用途 |
|------|------|------|
| `.animate-fade-in` | 上移淡入 | 元素出现 |
| `.animate-fade-in-up` | 上移40rpx淡入 | 列表项 |
| `.animate-fade-in-down` | 下移淡入 | 下拉内容 |
| `.animate-fade-in-scale` | 缩放淡入 | 弹窗 |
| `.animate-slide-up` | 底部滑入 | 底部弹窗 |
| `.animate-slide-down` | 顶部滑入 | 下拉面板 |
| `.animate-scale-in` | 缩放进入 | 弹出层 |
| `.animate-spin` | 旋转 | 加载 |
| `.animate-pulse` | 脉冲 | 呼吸效果 |
| `.animate-bounce` | 弹跳 | 提示 |
| `.animate-shake` | 抖动 | 错误反馈 |

### 5.2 骨架屏

```css
.skeleton  /* 渐变闪烁的占位块 */
```

---

## 六、布局规范

### 6.1 页面结构

```
┌─────────────────────────────────────┐
│  NavBar (fixed, z-100)              │
├─────────────────────────────────────┤
│  Content (scrollable)               │
│  padding: $spacing-page             │
├─────────────────────────────────────┤
│  TabBar (fixed, z-100)              │
│  .safe-bottom                       │
└─────────────────────────────────────┘
```

### 6.2 响应式断点

| Token | 值 | 用途 |
|-------|----|------|
| `$breakpoint-sm` | `576rpx` | 小屏 |
| `$breakpoint-md` | `768rpx` | 中屏 |
| `$breakpoint-lg` | `992rpx` | 大屏 |
| `$breakpoint-xl` | `1200rpx` | 超大屏 |

### 6.3 触摸目标

所有可交互元素最小尺寸 ≥ `$touch-target-min` (44rpx)

---

## 七、规范检查清单

### 7.1 视觉规范

- [ ] 颜色使用设计Token变量，禁止硬编码
- [ ] 字号使用Token规范
- [ ] 圆角使用Token规范
- [ ] 间距使用Token刻度
- [ ] 阴影使用Token规范

### 7.2 交互规范

- [ ] 按钮点击有缩放反馈
- [ ] 加载状态有Loading提示
- [ ] 错误状态有Toast/Modal提示
- [ ] 空状态有Empty组件
- [ ] 触摸目标 ≥ 44rpx

### 7.3 无障碍

- [ ] 图片有alt描述
- [ ] 颜色对比度 ≥ 4.5:1
- [ ] 可交互元素有明确视觉反馈

---

*文档版本：v2.0*
*更新日期：2026-06-03*
*适用项目：想想手作*
