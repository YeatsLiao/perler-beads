import type { Work } from '@/types';

export type PixelCell = string | null;
export type PixelPattern = PixelCell[][];

export interface DemoWork extends Work {
  palette: string[];
  pattern: PixelPattern;
  mood: string;
  authorLevel: string;
}

const empty = null;

export const catPattern: PixelPattern = [
  [empty, empty, '#4A3728', empty, empty, empty, empty, empty, '#4A3728', empty, empty],
  [empty, '#4A3728', '#FFB7C5', '#4A3728', empty, empty, empty, '#4A3728', '#FFB7C5', '#4A3728', empty],
  ['#4A3728', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#4A3728', '#4A3728', '#4A3728', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#4A3728'],
  ['#4A3728', '#FFE4B5', '#4A3728', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#4A3728', '#FFE4B5', '#4A3728'],
  ['#4A3728', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#FF8C69', '#FFE4B5', '#FF8C69', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#4A3728'],
  [empty, '#4A3728', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#4A3728', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#4A3728', empty],
  [empty, empty, '#4A3728', '#FFE4B5', '#FFB7C5', '#FFB7C5', '#FFB7C5', '#FFE4B5', '#4A3728', empty, empty],
  [empty, empty, empty, '#4A3728', '#FFE4B5', '#FFE4B5', '#FFE4B5', '#4A3728', empty, empty, empty],
  [empty, empty, empty, empty, '#4A3728', '#4A3728', '#4A3728', empty, empty, empty, empty]
];

export const sunsetPattern: PixelPattern = [
  ['#7AB8FF', '#7AB8FF', '#A8D8EA', '#A8D8EA', '#FFE4B5', '#FFE4B5', '#FFCBA4', '#FFCBA4', '#FFB7C5', '#FFB7C5', '#E6D5E7'],
  ['#7AB8FF', '#A8D8EA', '#A8D8EA', '#FFE4B5', '#FFD384', '#FFD384', '#FFCBA4', '#FF8C69', '#FFB7C5', '#E6D5E7', '#E6D5E7'],
  ['#A8D8EA', '#A8D8EA', '#FFE4B5', '#FFD384', '#FF8C69', '#FF8C69', '#FF8C69', '#FFCBA4', '#FFB7C5', '#E6D5E7', '#E6D5E7'],
  ['#A8D8EA', '#FFE4B5', '#FFD384', '#FF8C69', '#FF8C69', '#4A3728', '#FF8C69', '#FFCBA4', '#FFB7C5', '#E6D5E7', '#E6D5E7'],
  ['#B8E0D2', '#B8E0D2', '#7CB77C', '#7CB77C', '#4A3728', '#4A3728', '#4A3728', '#7CB77C', '#7CB77C', '#B8E0D2', '#B8E0D2'],
  ['#7CB77C', '#7CB77C', '#7CB77C', '#4A3728', '#4A3728', '#4A3728', '#4A3728', '#4A3728', '#7CB77C', '#7CB77C', '#7CB77C'],
  ['#4A3728', '#7CB77C', '#4A3728', '#4A3728', '#8B7355', '#8B7355', '#8B7355', '#4A3728', '#4A3728', '#7CB77C', '#4A3728'],
  ['#4A3728', '#4A3728', '#4A3728', '#8B7355', '#8B7355', '#8B7355', '#8B7355', '#8B7355', '#4A3728', '#4A3728', '#4A3728']
];

export const flowerPattern: PixelPattern = [
  [empty, empty, '#B8E0D2', empty, empty, empty, '#B8E0D2', empty, empty],
  [empty, '#FFB7C5', '#FF8C69', '#FFB7C5', empty, '#FFB7C5', '#FF8C69', '#FFB7C5', empty],
  ['#B8E0D2', '#FF8C69', '#FFD384', '#FF8C69', '#B8E0D2', '#FF8C69', '#FFD384', '#FF8C69', '#B8E0D2'],
  [empty, '#FFB7C5', '#FF8C69', '#FFB7C5', '#7CB77C', '#FFB7C5', '#FF8C69', '#FFB7C5', empty],
  [empty, empty, '#7CB77C', '#7CB77C', '#7CB77C', '#7CB77C', '#7CB77C', empty, empty],
  [empty, '#B8E0D2', '#7CB77C', '#7CB77C', '#4A3728', '#7CB77C', '#7CB77C', '#B8E0D2', empty],
  ['#B8E0D2', empty, empty, '#7CB77C', '#4A3728', '#7CB77C', empty, empty, '#B8E0D2'],
  [empty, empty, empty, '#4A3728', '#4A3728', '#4A3728', empty, empty, empty]
];

export const letterPattern: PixelPattern = [
  ['#4A3728', '#4A3728', '#4A3728', empty, '#FF8C69', empty, '#4A3728', '#4A3728', '#4A3728'],
  ['#4A3728', empty, empty, empty, '#FF8C69', empty, empty, empty, '#4A3728'],
  ['#4A3728', empty, empty, empty, '#FF8C69', empty, empty, empty, '#4A3728'],
  ['#4A3728', '#4A3728', '#4A3728', empty, '#FF8C69', empty, '#4A3728', '#4A3728', '#4A3728'],
  ['#4A3728', empty, empty, empty, '#FF8C69', empty, '#4A3728', empty, empty],
  ['#4A3728', empty, empty, empty, '#FF8C69', empty, '#4A3728', empty, empty],
  ['#4A3728', '#4A3728', '#4A3728', empty, '#FF8C69', empty, '#4A3728', '#4A3728', '#4A3728']
];

export const demoWorks: DemoWork[] = [
  {
    _id: 'cat',
    sketchId: 'sketch-cat',
    userId: 'u1',
    userInfo: { nickname: '手作达人', avatar: '' },
    title: '奶油小猫挂件',
    description: '11x9 小尺寸挂件，保留耳朵和腮红细节，适合新手练习。',
    tags: ['猫咪', '可爱', '入门'],
    category: 'cartoon',
    thumbnail: '',
    previewUrls: [],
    sketch: { width: 11, height: 9, pixelSize: 10, paletteId: 'perler_80', colorCount: 5 },
    stats: { likes: 128, views: 520, downloads: 64, comments: 3 },
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 2),
    publishedAt: new Date(Date.now() - 86400000),
    palette: ['#FFE4B5', '#FFB7C5', '#FF8C69', '#4A3728', '#FFFFFF'],
    pattern: catPattern,
    mood: '柔软奶油色',
    authorLevel: '新手友好'
  },
  {
    _id: 'sunset',
    sketchId: 'sketch-sunset',
    userId: 'u2',
    userInfo: { nickname: '创意玩家', avatar: '' },
    title: '落日小山丘',
    description: '渐变天空和深色山影组合，适合做杯垫或相框装饰。',
    tags: ['风景', '渐变', '治愈'],
    category: 'landscape',
    thumbnail: '',
    previewUrls: [],
    sketch: { width: 11, height: 8, pixelSize: 10, paletteId: 'artkal_s', colorCount: 9 },
    stats: { likes: 89, views: 340, downloads: 41, comments: 2 },
    createdAt: new Date(Date.now() - 86400000 * 6),
    updatedAt: new Date(Date.now() - 86400000 * 5),
    publishedAt: new Date(Date.now() - 86400000 * 4),
    palette: ['#7AB8FF', '#A8D8EA', '#FFE4B5', '#FFD384', '#FF8C69', '#FFB7C5', '#7CB77C', '#4A3728', '#8B7355'],
    pattern: sunsetPattern,
    mood: '黄昏渐变',
    authorLevel: '需要配色'
  },
  {
    _id: 'flower',
    sketchId: 'sketch-flower',
    userId: 'u3',
    userInfo: { nickname: '像素花房', avatar: '' },
    title: '双朵小花束',
    description: '花瓣和叶片用少量颜色表达层次，做胸针很合适。',
    tags: ['花朵', '礼物', '小物'],
    category: 'other',
    thumbnail: '',
    previewUrls: [],
    sketch: { width: 9, height: 8, pixelSize: 10, paletteId: 'perler_80', colorCount: 6 },
    stats: { likes: 156, views: 610, downloads: 73, comments: 5 },
    createdAt: new Date(Date.now() - 86400000 * 4),
    updatedAt: new Date(Date.now() - 86400000 * 3),
    publishedAt: new Date(Date.now() - 86400000 * 2),
    palette: ['#FFB7C5', '#FF8C69', '#FFD384', '#B8E0D2', '#7CB77C', '#4A3728'],
    pattern: flowerPattern,
    mood: '春日花束',
    authorLevel: '亲子适合'
  },
  {
    _id: 'letter',
    sketchId: 'sketch-letter',
    userId: 'u4',
    userInfo: { nickname: '字母工坊', avatar: '' },
    title: 'LOVE 字母牌',
    description: '极简字母图纸，可自由替换成名字首字母或节日标语。',
    tags: ['文字', '礼物', '节日'],
    category: 'text',
    thumbnail: '',
    previewUrls: [],
    sketch: { width: 9, height: 7, pixelSize: 10, paletteId: 'perler_80', colorCount: 2 },
    stats: { likes: 74, views: 280, downloads: 22, comments: 1 },
    createdAt: new Date(Date.now() - 86400000 * 8),
    updatedAt: new Date(Date.now() - 86400000 * 7),
    publishedAt: new Date(Date.now() - 86400000 * 6),
    palette: ['#4A3728', '#FF8C69'],
    pattern: letterPattern,
    mood: '复古字牌',
    authorLevel: '快速完成'
  }
];

export function getDemoWork(id?: string) {
  return demoWorks.find(work => work._id === id) || demoWorks[0];
}

export function createCheckerPattern(size = 10) {
  const colors = ['#FFB7C5', '#FFE4B5', '#B8E0D2', '#A8D8EA', '#E6D5E7'];
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => colors[(x * 2 + y * 3) % colors.length])
  );
}
