# 想想手作 - 拼豆创作工具

## 项目概述

**项目名称**：想想手作（XiangXiang Crafts）  
**项目类型**：跨平台移动应用（微信小程序 + App）  
**核心功能**：拼豆（Fuse Beads / Perler Beads）图纸创作工具，支持图片智能生成、手绘编辑、色号管理、作品分享  
**目标用户**：拼豆手工爱好者、DIY创作者、手作店主  
**技术栈**：uni-app (Vue 3 + TypeScript) + 微信云开发  
**项目状态**：设计阶段

---

## 目录结构

```
xiangxiang-crafts/
├── docs/
│   ├── specs/                    # 设计文档
│   │   ├── SPEC.md              # 主设计文档
│   │   └── changelog.md         # 版本变更记录
│   ├── api/                     # API 文档
│   │   └── README.md
│   └── assets/                  # 设计资源
│       ├── wireframes/
│       └── color-palettes/
├── src/
│   ├── pages/                   # 页面
│   ├── components/              # 组件
│   ├── utils/                   # 工具函数
│   ├── services/                # 服务层
│   ├── stores/                  # 状态管理
│   ├── constants/               # 常量定义
│   └── styles/                  # 样式
├── README.md
└── package.json
```

---

## 一、整体架构

### 1.1 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                        前端                              │
│              uni-app (Vue 3 + TypeScript)                │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐    │
│  │微信小程序│  iOS App │Android App│   H5    │抖音小程序│    │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘    │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                     云开发后端                            │
│  ┌──────────────┬──────────────┬──────────────┐         │
│  │  云函数       │   云数据库    │   云存储     │         │
│  │ (业务逻辑)    │ (用户/作品)   │ (图片存储)   │         │
│  └──────────────┴──────────────┴──────────────┘         │
└─────────────────────────────────────────────────────────┘
```

### 1.2 核心能力分层

```
┌─────────────────────────────────────────┐
│           表现层 (UI Layer)              │
│   Pages、Components、样式、动画           │
├─────────────────────────────────────────┤
│           业务层 (Business Layer)        │
│   页面逻辑、用户流程、数据处理             │
├─────────────────────────────────────────┤
│           服务层 (Service Layer)         │
│   Canvas 渲染、图像处理、导出服务         │
├─────────────────────────────────────────┤
│           数据层 (Data Layer)           │
│   云数据库、云存储、缓存策略              │
└─────────────────────────────────────────┘
```

---

## 二、功能模块详细设计

### 2.1 图片智能生成模块 ⭐核心

#### 2.1.1 功能流程

```
用户上传图片 → 图片预处理 → 像素化算法 → 色板匹配 → 预览对比 → 保存草稿
```

#### 2.1.2 图片预处理

| 步骤 | 说明 | 参数 |
|------|------|------|
| 压缩 | 限制最大尺寸 1024px | maxSize: 1024 |
| 缩放 | 按比例缩放到目标画布尺寸 | width, height |
| 锐化 | 可选，增强边缘 | strength: 0-100 |

#### 2.1.3 像素化算法

**算法流程**：
1. **降采样**：将图片缩放到目标像素网格尺寸
2. **颜色量化**：使用中位切分算法减少颜色数量
3. **色板匹配**：RGB 最近邻匹配到色板颜色

**参数配置**：

| 参数 | 范围 | 默认值 | 说明 |
|------|------|--------|------|
| pixelSize | 2-50 | 10 | 像素块大小（px） |
| colorCount | 8-256 | 64 | 目标颜色数量 |
| brightness | -100 ~ +100 | 0 | 亮度调整 |
| contrast | -100 ~ +100 | 0 | 对比度调整 |
| saturation | -100 ~ +100 | 0 | 饱和度调整 |

**核心代码实现**：

```typescript
// utils/pixelate.ts

interface PixelBlock {
  x: number;
  y: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

interface PaletteColor {
  id: string;
  name: string;
  hex: string;
  rgb: [number, number, number];
}

export class PixelProcessor {
  private canvas: CanvasContext;
  private palette: PaletteColor[];

  constructor(canvas: CanvasContext, palette: PaletteColor[]) {
    this.canvas = canvas;
    this.palette = palette;
  }

  /**
   * 像素化处理主函数
   */
  async pixelate(
    imageData: ImageData,
    options: {
      pixelSize: number;
      colorCount: number;
      brightness: number;
      contrast: number;
      saturation: number;
    }
  ): Promise<ImageData> {
    // 1. 预处理：调整亮度、对比度、饱和度
    const adjustedData = this.adjustImage(imageData, options);

    // 2. 颜色量化：减少颜色数量
    const quantizedData = this.quantizeColors(adjustedData, options.colorCount);

    // 3. 像素化：按块绘制
    const pixelatedData = this.createPixelatedImage(quantizedData, options.pixelSize);

    // 4. 色板匹配：替换为最接近的色板颜色
    const matchedData = this.matchToPalette(pixelatedData, options.pixelSize);

    return matchedData;
  }

  /**
   * 计算像素块的平均颜色
   */
  private calculateBlockColor(
    data: Uint8ClampedArray,
    width: number,
    startX: number,
    startY: number,
    blockSize: number
  ): PixelBlock {
    let r = 0, g = 0, b = 0, a = 0;
    let count = 0;

    const endX = Math.min(startX + blockSize, width);
    const endY = Math.min(startY + blockSize, data.length / (width * 4));

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const index = (y * width + x) * 4;
        r += data[index];
        g += data[index + 1];
        b += data[index + 2];
        a += data[index + 3];
        count++;
      }
    }

    return {
      x: startX,
      y: startY,
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count),
      a: Math.round(a / count)
    };
  }

  /**
   * RGB 最近邻颜色匹配
   */
  matchColor(rgb: [number, number, number]): PaletteColor {
    let minDistance = Infinity;
    let closestColor = this.palette[0];

    for (const color of this.palette) {
      const distance = Math.sqrt(
        Math.pow(rgb[0] - color.rgb[0], 2) +
        Math.pow(rgb[1] - color.rgb[1], 2) +
        Math.pow(rgb[2] - color.rgb[2], 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }

    return closestColor;
  }

  /**
   * 亮度调整
   */
  private adjustBrightness(data: Uint8ClampedArray, value: number): Uint8ClampedArray {
    const factor = (259 * (value + 255)) / (255 * (259 - value));
    const result = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
      result[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      result[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      result[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
      result[i + 3] = data[i + 3];
    }

    return result;
  }
}
```

### 2.2 像素画手绘编辑模块

#### 2.2.1 工具列表

| 工具ID | 名称 | 图标 | 功能说明 | 快捷键 |
|--------|------|------|----------|--------|
| pen | 画笔 | ✏️ | 绘制单个像素 | P |
| fill | 填充 | 🪣 | 区域填充 | F |
| eyedropper | 吸管 | 💉 | 取色 | I |
| eraser | 橡皮擦 | 🧹 | 删除像素 | E |
| select | 选区 | 🔲 | 框选区域 | S |
| move | 移动 | ✋ | 移动画布 | M |

#### 2.2.2 画布操作

| 操作 | 说明 | 手势 |
|------|------|------|
| 绘制 | 放置像素 | 点击/拖动 |
| 缩放 | 调整画布缩放比例 | 双指捏合 |
| 平移 | 移动画布视图 | 双指拖动 |
| 撤销 | 撤销上一步操作 | Ctrl+Z |
| 重做 | 重做撤销的操作 | Ctrl+Y |

#### 2.2.3 Canvas 工具类

```typescript
// utils/CanvasEditor.ts

type ToolType = 'pen' | 'fill' | 'eyedropper' | 'eraser' | 'select' | 'move';

interface EditorOptions {
  width: number;
  height: number;
  pixelSize: number;
  backgroundColor: string;
}

export class CanvasEditor {
  private canvas: uni.CanvasContext;
  private pixels: (string | null)[][];
  private history: string[][][];
  private historyIndex: number;
  private currentTool: ToolType;
  private currentColor: string;
  private scale: number;
  private offsetX: number;
  private offsetY: number;

  constructor(canvasId: string, options: EditorOptions) {
    this.canvas = uni.createCanvasContext(canvasId);
    this.pixels = Array(options.height).fill(null).map(() =>
      Array(options.width).fill(null)
    );
    this.history = [JSON.parse(JSON.stringify(this.pixels))];
    this.historyIndex = 0;
    this.currentTool = 'pen';
    this.currentColor = '#000000';
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  /**
   * 使用工具绘制
   */
  useTool(x: number, y: number, action: 'start' | 'move' | 'end') {
    const gridX = Math.floor((x - this.offsetX) / this.scale / this.pixelSize);
    const gridY = Math.floor((y - this.offsetY) / this.scale / this.pixelSize);

    switch (this.currentTool) {
      case 'pen':
        this.drawPixel(gridX, gridY);
        break;
      case 'fill':
        if (action === 'start') this.floodFill(gridX, gridY);
        break;
      case 'eyedropper':
        if (action === 'start') this.pickColor(gridX, gridY);
        break;
      case 'eraser':
        this.erasePixel(gridX, gridY);
        break;
    }
  }

  /**
   * 洪水填充算法
   */
  private floodFill(startX: number, startY: number) {
    const targetColor = this.pixels[startY]?.[startX];
    if (targetColor === this.currentColor) return;

    const stack = [[startX, startY]];
    const width = this.pixels[0].length;
    const height = this.pixels.length;

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;

      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      if (this.pixels[y][x] !== targetColor) continue;

      this.pixels[y][x] = this.currentColor;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    this.saveHistory();
    this.render();
  }

  /**
   * 撤销
   */
  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.pixels = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.render();
    }
  }

  /**
   * 重做
   */
  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.pixels = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.render();
    }
  }

  /**
   * 保存历史记录
   */
  private saveHistory() {
    // 移除当前位置之后的历史
    this.history = this.history.slice(0, this.historyIndex + 1);
    // 添加新状态
    this.history.push(JSON.parse(JSON.stringify(this.pixels)));
    this.historyIndex = this.history.length - 1;

    // 限制历史记录数量
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  /**
   * 渲染画布
   */
  render() {
    const width = this.pixels[0].length;
    const height = this.pixels.length;

    // 清空画布
    this.canvas.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制每个像素
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const color = this.pixels[y][x];
        if (color) {
          this.canvas.setFillStyle(color);
          this.canvas.fillRect(
            x * this.pixelSize,
            y * this.pixelSize,
            this.pixelSize,
            this.pixelSize
          );
        }
      }
    }

    this.canvas.draw();
  }
}
```

### 2.3 色号系统模块

#### 2.3.1 支持的色板

| 品牌 | 代码 | 颜色数量 | 规格 | 备注 |
|------|------|----------|------|------|
| Perler | PERLER | 80 | 5mm | 美系主推 |
| Artkal | ARTKAL_S | 188 | 5mm | 含迷你豆 |
| Artkal Mini | ARTKAL_M | 72 | M/2.6mm | 迷你豆 |
| HAMA | HAMA | 50 | Midi 5mm | 欧系 |
| Nabbi | NABBI | 40 | 5mm | 亲子友好 |
| MARD | MARD | 168 | 5mm | 性价比高 |
| IKEA Pyssla | PYSSLA | 42 | 5mm | 入门级 |
| 自定义 | CUSTOM | 无限制 | - | 用户自定义 |

#### 2.3.2 色板数据结构

```typescript
// constants/palettes.ts

export interface ColorEntry {
  id: string;           // 色号编号
  name: string;         // 颜色中文名
  nameEn: string;       // 颜色英文名
  hex: string;          // #RRGGBB
  rgb: [number, number, number];  // [R, G, B]
}

export interface Palette {
  id: string;           // 色板唯一标识
  brand: string;        // 品牌名
  brandCn: string;      // 品牌中文名
  code: string;         // 品牌代码
  beadSize: '5mm' | '2.6mm' | 'mixed';
  colors: ColorEntry[];
}

// 色板数据示例
export const PERLER_PALETTE: Palette = {
  id: 'perler_80',
  brand: 'Perler',
  brandCn: 'Perler',
  code: 'PERLER',
  beadSize: '5mm',
  colors: [
    { id: '00000', name: '纯白', nameEn: 'White', hex: '#FFFFFF', rgb: [255, 255, 255] },
    { id: '00014', name: '浅粉', nameEn: 'Light Pink', hex: '#FFB7C5', rgb: [255, 183, 197] },
    // ... 更多颜色
  ]
};
```

#### 2.3.3 色号统计功能

```typescript
// services/ColorCounter.ts

interface ColorStats {
  colorId: string;
  colorName: string;
  hex: string;
  count: number;        // 像素数量
  percentage: number;   // 占比
  beadCount: number;   // 所需颗粒数（等于像素数）
}

export class ColorCounter {
  /**
   * 统计画布中每种颜色的使用情况
   */
  countColors(pixels: (string | null)[][], palette: Palette): ColorStats[] {
    const colorMap = new Map<string, number>();
    let totalPixels = 0;

    // 遍历所有像素
    for (const row of pixels) {
      for (const color of row) {
        if (color) {
          const count = colorMap.get(color) || 0;
          colorMap.set(color, count + 1);
          totalPixels++;
        }
      }
    }

    // 转换为统计结果
    const stats: ColorStats[] = [];
    const paletteMap = new Map(palette.colors.map(c => [c.hex.toUpperCase(), c]));

    for (const [hex, count] of colorMap) {
      const colorInfo = paletteMap.get(hex.toUpperCase());
      if (colorInfo) {
        stats.push({
          colorId: colorInfo.id,
          colorName: colorInfo.name,
          hex: colorInfo.hex,
          count,
          percentage: Math.round((count / totalPixels) * 10000) / 100,
          beadCount: count
        });
      }
    }

    // 按数量降序排序
    return stats.sort((a, b) => b.count - a.count);
  }

  /**
   * 生成备料清单
   */
  generateMaterialList(stats: ColorStats[]): MaterialItem[] {
    return stats.map(stat => ({
      colorId: stat.colorId,
      colorName: stat.colorName,
      hex: stat.hex,
      quantity: stat.beadCount,
      unit: '颗'
    }));
  }
}
```

### 2.4 导出功能模块

#### 2.4.1 导出格式

| 格式 | 扩展名 | 用途 | 支持选项 |
|------|--------|------|----------|
| PNG | .png | 数字存档、打印 | 倍率、网格、色号、镜像 |
| JPG | .jpg | 社交分享 | 质量、压缩 |
| PDF | .pdf | 专业打印 | 含网格、标题、色号图例 |

#### 2.4.2 导出选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| scale | number | 1 | 导出倍率 1x/2x/3x/5x |
| showGrid | boolean | false | 显示像素网格线 |
| showColorId | boolean | false | 显示色号标注 |
| flipHorizontal | boolean | false | 水平镜像翻转 |
| background | 'transparent' \| 'white' \| 'color' | 'white' | 背景设置 |

#### 2.4.3 导出服务

```typescript
// services/ExportService.ts

interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  scale: number;
  showGrid: boolean;
  showColorId: boolean;
  flipHorizontal: boolean;
  background: 'transparent' | 'white' | 'color';
  quality?: number;  // JPG 质量 0-100
}

export class ExportService {
  /**
   * 导出图片
   */
  async export(
    pixels: (string | null)[][],
    palette: Palette,
    options: ExportOptions
  ): Promise<string> {
    const canvas = this.createExportCanvas(pixels, options);
    const dataUrl = canvas.toDataURL(`image/${options.format}`, options.quality / 100);

    if (options.format === 'pdf') {
      return this.generatePDF(dataUrl, pixels, palette, options);
    }

    return dataUrl;
  }

  /**
   * 创建导出用 Canvas
   */
  private createExportCanvas(
    pixels: (string | null)[][],
    options: ExportOptions
  ): HTMLCanvasElement {
    const width = pixels[0].length * options.scale;
    const height = pixels.length * options.scale;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // 填充背景
    if (options.background === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    // 绘制像素
    for (let y = 0; y < pixels.length; y++) {
      for (let x = 0; x < pixels[y].length; x++) {
        const color = pixels[y][x];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x * options.scale, y * options.scale, options.scale, options.scale);
        }
      }
    }

    // 绘制网格
    if (options.showGrid) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1;
      for (let x = 0; x <= pixels[0].length; x++) {
        ctx.beginPath();
        ctx.moveTo(x * options.scale, 0);
        ctx.lineTo(x * options.scale, height);
        ctx.stroke();
      }
      for (let y = 0; y <= pixels.length; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * options.scale);
        ctx.lineTo(width, y * options.scale);
        ctx.stroke();
      }
    }

    return canvas;
  }

  /**
   * 生成 PDF
   */
  private async generatePDF(
    dataUrl: string,
    pixels: (string | null)[][],
    palette: Palette,
    options: ExportOptions
  ): Promise<string> {
    // 使用 jsPDF 库生成 PDF
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({
      orientation: pixels[0].length > pixels.length ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // 添加标题
    pdf.setFontSize(16);
    pdf.text('拼豆图纸', 10, 10);

    // 添加图纸图片
    const imgWidth = 180;
    const imgHeight = (pixels.length / pixels[0].length) * imgWidth;
    pdf.addImage(dataUrl, 'PNG', 10, 20, imgWidth, imgHeight);

    // 添加色号图例
    const stats = new ColorCounter().countColors(pixels, palette);
    let y = 20 + imgHeight + 10;
    pdf.setFontSize(10);

    for (const stat of stats.slice(0, 20)) {  // 最多显示20个颜色
      pdf.setFillColor(stat.hex);
      pdf.rect(10, y, 5, 5, 'F');
      pdf.text(`${stat.colorId} - ${stat.colorName}: ${stat.beadCount}颗`, 18, y + 4);
      y += 7;
    }

    return pdf.output('datauristring');
  }
}
```

### 2.5 作品广场模块

#### 2.5.1 功能结构

```
作品广场
├── 首页
│   ├── Banner 轮播
│   ├── 快捷入口
│   │   ├── 分类浏览
│   │   ├── 热门标签
│   │   └── 我的收藏
│   ├── 瀑布流作品列表
│   └── 搜索栏
│
├── 分类页
│   ├── 标签筛选
│   ├── 排序选项（最新/最热/精选）
│   └── 作品网格
│
├── 搜索页
│   ├── 搜索历史
│   ├── 热门搜索
│   └── 搜索结果
│
└── 作品详情页
    ├── 作品预览（可缩放）
    ├── 基本信息
    │   ├── 标题
    │   ├── 作者
    │   ├── 创建时间
    │   └── 尺寸/色数
    ├── 互动栏
    │   ├── 点赞
    │   ├── 收藏
    │   └── 分享
    ├── 评论区域
    ├── 操作栏
    │   ├── 下载图纸
    │   ├── 复用创作
    │   └── 举报
    └── 相关推荐
```

#### 2.5.2 数据模型

```typescript
// models/Work.ts

interface Work {
  _id: string;
  sketchId: string;
  userId: string;
  userInfo: {
    nickname: string;
    avatar: string;
  };

  // 作品信息
  title: string;
  description?: string;
  tags: string[];
  category: 'cartoon' | 'character' | 'landscape' | 'text' | 'other';

  // 视觉资源
  thumbnail: string;          // 缩略图
  previewUrls: string[];      // 预览图列表

  // 技术信息
  sketch: {
    width: number;
    height: number;
    pixelSize: number;
    paletteId: string;
    colorCount: number;
  };

  // 统计数据
  stats: {
    likes: number;
    views: number;
    downloads: number;
    comments: number;
  };

  // 用户交互状态
  userAction?: {
    isLiked: boolean;
    isFavorited: boolean;
  };

  // 时间戳
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

interface Comment {
  _id: string;
  workId: string;
  userId: string;
  userInfo: {
    nickname: string;
    avatar: string;
  };
  content: string;
  likes: number;
  replies?: Comment[];
  createdAt: Date;
}
```

---

## 三、数据模型设计

### 3.1 数据库集合

```
┌─────────────────────────────────────────────────────┐
│                    Cloud Database                    │
├─────────────────────────────────────────────────────┤
│  users          - 用户信息                           │
│  sketches       - 草稿/作品草图                       │
│  works          - 已发布作品                         │
│  palettes       - 色板数据                           │
│  categories     - 分类标签                           │
│  comments       - 评论                              │
│  likes          - 点赞记录                           │
│  favorites      - 收藏记录                           │
└─────────────────────────────────────────────────────┘
```

### 3.2 集合结构

```typescript
// models/Collection.ts

// 用户集合
interface User {
  _id: string;
  openid?: string;           // 微信 openid
  nickname: string;
  avatar: string;
  bio?: string;              // 个人简介

  // 统计数据
  stats: {
    worksCount: number;      // 作品数
    followers: number;       // 粉丝数
    following: number;      // 关注数
  };

  // 设置
  settings: {
    defaultPalette: string;   // 默认色板
    defaultSize: { width: number; height: number };
  };

  createdAt: Date;
  updatedAt: Date;
}

// 草图集合
interface Sketch {
  _id: string;
  userId: string;

  // 基本信息
  title: string;
  description?: string;

  // 画布信息
  canvas: {
    width: number;
    height: number;
    pixelSize: number;
  };

  // 色板信息
  paletteId: string;

  // 像素数据（存储为 Base64 编码的 JSON）
  pixels: string;            // JSON.stringify(number[][])
  colorStats?: string;       // 颜色统计缓存

  // 缩略图
  thumbnail?: string;

  // 发布状态
  isPublic: boolean;
  isDraft: boolean;

  // 标签
  tags: string[];
  category?: string;

  // 时间戳
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}
```

### 3.3 索引设计

```javascript
// 数据库索引配置

// works 集合
db.works.createIndex({ publishedAt: -1 });           // 最新发布
db.works.createIndex({ 'stats.likes': -1 });         // 热门作品
db.works.createIndex({ userId: 1 });                  // 用户作品
db.works.createIndex({ tags: 1 });                    // 标签聚合
db.works.createIndex({ category: 1, publishedAt: -1 });// 分类浏览

// sketches 集合
db.sketches.createIndex({ userId: 1, updatedAt: -1 }); // 用户草稿

// likes/favorites 集合
db.likes.createIndex({ workId: 1, userId: 1 });       // 联合唯一索引
db.favorites.createIndex({ workId: 1, userId: 1 });  // 联合唯一索引
```

---

## 四、页面结构设计

### 4.1 页面路由

```typescript
// pages.json

{
  "pages": [
    // TabBar 页面
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/create/index",
      "style": {
        "navigationBarTitleText": "创作中心"
      }
    },
    {
      "path": "pages/works/index",
      "style": {
        "navigationBarTitleText": "我的作品"
      }
    },
    {
      "path": "pages/profile/index",
      "style": {
        "navigationBarTitleText": "个人中心"
      }
    },

    // 功能页面
    {
      "path": "pages/generate/index",
      "style": {
        "navigationBarTitleText": "图片生成"
      }
    },
    {
      "path": "pages/editor/index",
      "style": {
        "navigationBarTitleText": "编辑器",
        "navigationStyle": "custom"
      }
    },
    {
      "path": "pages/export/index",
      "style": {
        "navigationBarTitleText": "导出"
      }
    },
    {
      "path": "pages/work-detail/index",
      "style": {
        "navigationBarTitleText": "作品详情"
      }
    },
    {
      "path": "pages/search/index",
      "style": {
        "navigationBarTitleText": "搜索"
      }
    }
  ],

  "tabBar": {
    "color": "#999999",
    "selectedColor": "#FF6B6B",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/tabbar/home.png",
        "selectedIconPath": "static/tabbar/home-active.png"
      },
      {
        "pagePath": "pages/create/index",
        "text": "创作",
        "iconPath": "static/tabbar/create.png",
        "selectedIconPath": "static/tabbar/create-active.png"
      },
      {
        "pagePath": "pages/works/index",
        "text": "我的",
        "iconPath": "static/tabbar/works.png",
        "selectedIconPath": "static/tabbar/works-active.png"
      },
      {
        "pagePath": "pages/profile/index",
        "text": "我的",
        "iconPath": "static/tabbar/profile.png",
        "selectedIconPath": "static/tabbar/profile-active.png"
      }
    ]
  }
}
```

### 4.2 页面组件结构

```
pages/
├── index/                      # 首页（作品广场）
│   ├── index.vue
│   ├── components/
│   │   ├── Banner.vue          # 轮播图
│   │   ├── CategoryGrid.vue    # 分类网格
│   │   ├── WorkCard.vue        # 作品卡片
│   │   └── WorkList.vue        # 作品列表
│   └── hooks/
│       └── useWorks.ts         # 作品数据 Hook
│
├── create/                     # 创作中心
│   ├── index.vue
│   └── components/
│       └── CreateMethodCard.vue # 创建方式卡片
│
├── generate/                   # 图片生成页
│   ├── index.vue
│   └── components/
│       ├── ImageUploader.vue   # 图片上传
│       ├── ImagePreview.vue    # 预览对比
│       └── GenerateOptions.vue # 参数设置
│
├── editor/                     # 编辑器页
│   ├── index.vue
│   ├── components/
│   │   ├── Canvas.vue          # 画布组件
│   │   ├── Toolbar.vue        # 工具栏
│   │   ├── ColorPalette.vue    # 色板选择
│   │   ├── HistoryPanel.vue    # 历史记录
│   │   └── ColorStats.vue      # 颜色统计
│   └── hooks/
│       ├── useCanvas.ts        # Canvas 操作
│       └── useTools.ts         # 工具管理
│
├── works/                      # 我的作品
│   ├── index.vue
│   └── components/
│       ├── WorkGrid.vue        # 作品网格
│       └── DraftList.vue       # 草稿列表
│
└── profile/                    # 个人中心
    ├── index.vue
    └── components/
        ├── ProfileHeader.vue   # 头像区域
        └── SettingsList.vue    # 设置列表
```

---

## 五、API 接口设计

### 5.1 接口概览

| 模块 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户 | POST | /user/login | 微信登录 |
| 用户 | GET | /user/profile | 获取用户信息 |
| 用户 | PUT | /user/profile | 更新用户信息 |
| 草图 | POST | /sketch | 创建草稿 |
| 草图 | GET | /sketch/:id | 获取草稿详情 |
| 草图 | PUT | /sketch/:id | 更新草稿 |
| 草图 | DELETE | /sketch/:id | 删除草稿 |
| 作品 | POST | /work/publish | 发布作品 |
| 作品 | GET | /work/:id | 获取作品详情 |
| 作品 | GET | /work/list | 获取作品列表 |
| 作品 | DELETE | /work/:id | 删除作品 |
| 互动 | POST | /interaction/like | 点赞 |
| 互动 | DELETE | /interaction/like | 取消点赞 |
| 互动 | POST | /interaction/favorite | 收藏 |
| 互动 | DELETE | /interaction/favorite | 取消收藏 |
| 评论 | POST | /comment | 发表评论 |
| 评论 | GET | /comment/list | 获取评论列表 |

### 5.2 核心接口详情

```typescript
// 接口请求/响应类型定义

// 获取作品列表
interface GetWorkListRequest {
  page: number;
  pageSize: number;
  category?: string;
  tag?: string;
  sortBy?: 'latest' | 'hot' | 'recommended';
  keyword?: string;
}

interface GetWorkListResponse {
  list: Work[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 创建草稿
interface CreateSketchRequest {
  title: string;
  canvas: {
    width: number;
    height: number;
    pixelSize: number;
  };
  paletteId: string;
  pixels: string;           // Base64 编码的像素数据
  thumbnail?: string;
  isDraft: boolean;
}

interface CreateSketchResponse {
  id: string;
  createdAt: Date;
}

// 发布作品
interface PublishWorkRequest {
  sketchId: string;
  title: string;
  description?: string;
  tags: string[];
  category: string;
  thumbnail: string;
}

interface PublishWorkResponse {
  id: string;
  publishedAt: Date;
}
```

---

## 六、关键技术方案

### 6.1 图片处理性能优化

**问题**：大尺寸图片处理可能导致主线程阻塞

**解决方案**：
1. **图片压缩**：上传前压缩到最大 1024px
2. **分帧处理**：使用 `requestAnimationFrame` 分批处理像素
3. **离屏渲染**：使用 OffscreenCanvas（在支持的环境）
4. **缓存机制**：缓存处理结果，避免重复计算

```typescript
// utils/ImageProcessor.ts

export class ImageProcessor {
  /**
   * 分帧像素化处理
   */
  async pixelateInChunks(
    imageData: ImageData,
    options: PixelateOptions,
    chunkSize: number = 32,
    onProgress?: (percent: number) => void
  ): Promise<ImageData> {
    const width = imageData.width;
    const height = imageData.height;
    const result = new ImageData(width, height);

    let processedRows = 0;
    const totalRows = Math.ceil(height / chunkSize);

    return new Promise((resolve) => {
      const processChunk = () => {
        const endRow = Math.min(processedRows + chunkSize, height);

        for (let y = processedRows; y < endRow; y++) {
          for (let x = 0; x < width; x++) {
            // 处理单个像素...
            const newColor = this.processPixel(imageData, x, y, options);
            this.setPixel(result, x, y, newColor);
          }
        }

        processedRows = endRow;
        onProgress?.(Math.round((processedRows / height) * 100));

        if (processedRows < height) {
          requestAnimationFrame(processChunk);
        } else {
          resolve(result);
        }
      };

      processChunk();
    });
  }
}
```

### 6.2 Canvas 渲染优化

**问题**：频繁重绘导致卡顿

**解决方案**：
1. **脏区域检测**：只重绘变化的区域
2. **双缓冲**：使用离屏 Canvas 缓存完整画面
3. **节流绘制**：限制每秒绘制次数

```typescript
// utils/CanvasRenderer.ts

export class CanvasRenderer {
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private dirtyRect: { x: number; y: number; w: number; h: number } | null;

  constructor(width: number, height: number) {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;
    this.offscreenCtx = this.offscreenCanvas.getContext('2d')!;
  }

  /**
   * 标记需要重绘的区域
   */
  markDirty(x: number, y: number, w: number, h: number) {
    if (this.dirtyRect) {
      // 合并脏区域
      const minX = Math.min(this.dirtyRect.x, x);
      const minY = Math.min(this.dirtyRect.y, y);
      const maxX = Math.max(this.dirtyRect.x + this.dirtyRect.w, x + w);
      const maxY = Math.max(this.dirtyRect.y + this.dirtyRect.h, y + h);
      this.dirtyRect = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    } else {
      this.dirtyRect = { x, y, w, h };
    }
  }

  /**
   * 渲染到主画布（只绘制脏区域）
   */
  render(mainCtx: CanvasRenderingContext2D) {
    if (this.dirtyRect) {
      mainCtx.drawImage(
        this.offscreenCanvas,
        this.dirtyRect.x,
        this.dirtyRect.y,
        this.dirtyRect.w,
        this.dirtyRect.h,
        this.dirtyRect.x,
        this.dirtyRect.y,
        this.dirtyRect.w,
        this.dirtyRect.h
      );
      this.dirtyRect = null;
    }
  }
}
```

### 6.3 多端兼容性处理

**问题**：Canvas API 在不同平台有差异

**解决方案**：
1. 封装统一的 Canvas 工具类
2. 针对微信小程序做特殊处理
3. 使用 uni-app 的跨端 API

```typescript
// utils/CrossPlatformCanvas.ts

export class CrossPlatformCanvas {
  private context: any;

  constructor(canvasId: string) {
    // #ifdef MP-WEIXIN
    this.context = uni.createCanvasContext(canvasId);
    // #endif

    // #ifndef MP-WEIXIN
    const canvas = document.getElementById(canvasId);
    this.context = canvas.getContext('2d');
    // #endif
  }

  /**
   * 统一的数据结构
   */
  getImageData(x: number, y: number, width: number, height: number): ImageData {
    // #ifdef MP-WEIXIN
    // 微信小程序使用 getImageData
    return new Promise((resolve) => {
      this.context.getImageData({
        x, y, width, height,
        success: (res: any) => resolve(res)
      });
    });
    // #endif

    // #ifndef MP-WEIXIN
    return this.context.getImageData(x, y, width, height);
    // #endif
  }

  /**
   * 统一绑定触摸事件
   */
  onTouch(
    callbacks: {
      onStart?: (e: TouchEvent) => void;
      onMove?: (e: TouchEvent) => void;
      onEnd?: (e: TouchEvent) => void;
    }
  ) {
    // #ifdef MP-WEIXIN
    this.context.onTouchStart(callbacks.onStart);
    this.context.onTouchMove(callbacks.onMove);
    this.context.onTouchEnd(callbacks.onEnd);
    // #endif

    // #ifndef MP-WEIXIN
    // Web 端使用原生事件
    // ...
    // #endif
  }
}
```

---

## 七、开发计划

### 7.1 版本规划

| 版本 | 阶段 | 功能范围 | 预计周期 |
|------|------|----------|----------|
| MVP v1.0 | 基础能力 | 图片生成 + 基础编辑 + 色板 + 导出 | 2-3 周 |
| v1.1 | 编辑增强 | 手绘工具完善 + 撤销/重做 + 选区工具 | 1 周 |
| v1.2 | 用户系统 | 用户登录 + 我的作品 + 草稿管理 | 1 周 |
| v2.0 | 社区功能 | 作品广场 + 社交互动 + 搜索发现 | 2-3 周 |
| v2.1 | 高级功能 | 多图层 + 特殊效果 + 批量操作 | 2 周 |

### 7.2 MVP 功能清单

- [ ] 图片上传与预览
- [ ] 图片像素化处理
- [ ] 像素大小调节
- [ ] 颜色数量控制
- [ ] 亮度/对比度/饱和度调整
- [ ] Perler 80 色板
- [ ] Artkal 188 色板
- [ ] 基础绘画工具（画笔、橡皮擦）
- [ ] 填充工具
- [ ] 吸管取色
- [ ] PNG 导出
- [ ] 导出倍率选择
- [ ] 网格显示
- [ ] 色号标注

---

## 八、可参考的开源项目

| 项目 | 链接 | 参考价值 | 许可 |
|------|------|----------|------|
| pindou-draw | https://github.com/MXBraisedFish/pindou-draw | ⭐⭐⭐⭐⭐ 功能完整、UI参考 | MIT |
| 拼豆像素画生成器 | https://github.com/yongye666/pindou | ⭐⭐⭐⭐ 色板数据库 | - |
| perler-beads-server | https://github.com/LingNc/perler-beads-server | ⭐⭐⭐ 架构参考 | - |
| Pixelizer | https://pixelizer.gitlab.io/ | ⭐⭐⭐ 在线工具参考 | - |
| fast-pixelizer | https://www.npmjs.com/package/fast-pixelizer | ⭐⭐⭐ 像素化算法 | MIT |

---

## 九、附录

### 9.1 名词解释

| 术语 | 说明 |
|------|------|
| 拼豆 | 一种塑料像素手工艺品，通过熨烫固定 |
| Perler Beads | 美国拼豆品牌，代表性产品 |
| 像素化 | 将图片转换为像素风格的过程 |
| 色板 | 拼豆品牌的颜色集合 |
| 熨烫 | 用熨斗加热拼豆使其融合的工艺 |

### 9.2 常见尺寸对照

| 画布尺寸 | 适用场景 | 颗粒总数 |
|----------|----------|----------|
| 29×29 | 经典正方形 | 841 |
| 29×19 | 长条形 | 551 |
| 29×15 | 竖长条 | 435 |
| 29×10 | 扁长条 | 290 |
| 32×32 | 大正方形 | 1024 |
| 64×64 | 超大图案 | 4096 |

---

*文档版本：v1.0*  
*创建日期：2026-05-08*  
*最后更新：2026-05-08*
