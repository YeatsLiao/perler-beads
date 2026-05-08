export interface ColorEntry {
  id: string;
  name: string;
  nameEn: string;
  hex: string;
  rgb: [number, number, number];
}

export interface Palette {
  id: string;
  brand: string;
  brandCn: string;
  code: string;
  beadSize: '5mm' | '2.6mm' | 'mixed';
  colors: ColorEntry[];
}

export interface Sketch {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  canvas: {
    width: number;
    height: number;
    pixelSize: number;
  };
  paletteId: string;
  pixels: string;
  colorStats?: string;
  thumbnail?: string;
  isPublic: boolean;
  isDraft: boolean;
  tags: string[];
  category?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Work {
  _id: string;
  sketchId: string;
  userId: string;
  userInfo: {
    nickname: string;
    avatar: string;
  };
  title: string;
  description?: string;
  tags: string[];
  category: 'cartoon' | 'character' | 'landscape' | 'text' | 'other';
  thumbnail: string;
  previewUrls: string[];
  sketch: {
    width: number;
    height: number;
    pixelSize: number;
    paletteId: string;
    colorCount: number;
  };
  stats: {
    likes: number;
    views: number;
    downloads: number;
    comments: number;
  };
  userAction?: {
    isLiked: boolean;
    isFavorited: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Comment {
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

export type ToolType = 'pen' | 'fill' | 'eyedropper' | 'eraser' | 'select' | 'move';

export interface EditorOptions {
  width: number;
  height: number;
  pixelSize: number;
  backgroundColor: string;
}

export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  scale: number;
  showGrid: boolean;
  showColorId: boolean;
  flipHorizontal: boolean;
  background: 'transparent' | 'white' | 'color';
  quality?: number;
}
