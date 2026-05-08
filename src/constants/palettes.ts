import type { Palette, ColorEntry } from '@/types';

export const PERLER_COLORS: ColorEntry[] = [
  { id: '00000', name: '纯白', nameEn: 'White', hex: '#FFFFFF', rgb: [255, 255, 255] },
  { id: '00014', name: '浅粉', nameEn: 'Light Pink', hex: '#FFB7C5', rgb: [255, 183, 197] },
  { id: '00015', name: '粉红', nameEn: 'Pink', hex: '#FF69B4', rgb: [255, 105, 180] },
  { id: '00016', name: '深粉', nameEn: 'Deep Pink', hex: '#FF1493', rgb: [255, 20, 147] },
  { id: '00017', name: '珊瑚', nameEn: 'Coral', hex: '#FF7F50', rgb: [255, 127, 80] },
  { id: '00018', name: '橙红', nameEn: 'Orange Red', hex: '#FF4500', rgb: [255, 69, 0] },
  { id: '00019', name: '橙色', nameEn: 'Orange', hex: '#FFA500', rgb: [255, 165, 0] },
  { id: '00020', name: '金黄', nameEn: 'Golden', hex: '#FFD700', rgb: [255, 215, 0] },
  { id: '00021', name: '黄色', nameEn: 'Yellow', hex: '#FFFF00', rgb: [255, 255, 0] },
  { id: '00022', name: '浅黄', nameEn: 'Light Yellow', hex: '#FFFFE0', rgb: [255, 255, 224] },
  { id: '00023', name: '柠檬', nameEn: 'Lemon', hex: '#FFFACD', rgb: [255, 250, 205] },
  { id: '00024', name: '薄荷', nameEn: 'Mint', hex: '#98FF98', rgb: [152, 255, 152] },
  { id: '00025', name: '浅绿', nameEn: 'Light Green', hex: '#90EE90', rgb: [144, 238, 144] },
  { id: '00026', name: '绿', nameEn: 'Green', hex: '#00FF00', rgb: [0, 255, 0] },
  { id: '00027', name: '深绿', nameEn: 'Dark Green', hex: '#006400', rgb: [0, 100, 0] },
  { id: '00028', name: '蓝绿', nameEn: 'Teal', hex: '#008080', rgb: [0, 128, 128] },
  { id: '00029', name: '浅蓝', nameEn: 'Light Blue', hex: '#ADD8E6', rgb: [173, 216, 230] },
  { id: '00030', name: '天蓝', nameEn: 'Sky Blue', hex: '#87CEEB', rgb: [135, 206, 235] },
  { id: '00031', name: '蓝', nameEn: 'Blue', hex: '#0000FF', rgb: [0, 0, 255] },
  { id: '00032', name: '深蓝', nameEn: 'Dark Blue', hex: '#00008B', rgb: [0, 0, 139] },
  { id: '00033', name: '靛蓝', nameEn: 'Indigo', hex: '#4B0082', rgb: [75, 0, 130] },
  { id: '00034', name: '紫', nameEn: 'Purple', hex: '#800080', rgb: [128, 0, 128] },
  { id: '00035', name: '浅紫', nameEn: 'Light Purple', hex: '#DDA0DD', rgb: [221, 160, 221] },
  { id: '00036', name: '紫红', nameEn: 'Fuchsia', hex: '#FF00FF', rgb: [255, 0, 255] },
  { id: '00037', name: '棕', nameEn: 'Brown', hex: '#A0522D', rgb: [160, 82, 45] },
  { id: '00038', name: '深棕', nameEn: 'Dark Brown', hex: '#8B4513', rgb: [139, 69, 19] },
  { id: '00039', name: '灰色', nameEn: 'Gray', hex: '#808080', rgb: [128, 128, 128] },
  { id: '00040', name: '深灰', nameEn: 'Dark Gray', hex: '#696969', rgb: [105, 105, 105] },
  { id: '00041', name: '黑', nameEn: 'Black', hex: '#000000', rgb: [0, 0, 0] },
  { id: '00042', name: '肤色', nameEn: 'Peach', hex: '#FFDAB9', rgb: [255, 218, 185] },
];

export const PERLER_PALETTE: Palette = {
  id: 'perler_80',
  brand: 'Perler',
  brandCn: 'Perler',
  code: 'PERLER',
  beadSize: '5mm',
  colors: PERLER_COLORS
};

export const ARTKAL_COLORS: ColorEntry[] = [
  { id: 'S001', name: '白色', nameEn: 'White', hex: '#FFFFFF', rgb: [255, 255, 255] },
  { id: 'S002', name: '乳白', nameEn: 'Ivory', hex: '#FFFFF0', rgb: [255, 255, 240] },
  { id: 'S003', name: '米白', nameEn: 'Cream', hex: '#FFFDD0', rgb: [255, 253, 208] },
  { id: 'S004', name: '浅粉', nameEn: 'Light Pink', hex: '#FFB7C5', rgb: [255, 183, 197] },
  { id: 'S005', name: '粉红', nameEn: 'Pink', hex: '#FF69B4', rgb: [255, 105, 180] },
  { id: 'S006', name: '玫红', nameEn: 'Rose', hex: '#FF1493', rgb: [255, 20, 147] },
  { id: 'S007', name: '珊瑚', nameEn: 'Coral', hex: '#FF7F50', rgb: [255, 127, 80] },
  { id: 'S008', name: '橙', nameEn: 'Orange', hex: '#FFA500', rgb: [255, 165, 0] },
  { id: 'S009', name: '金黄', nameEn: 'Golden', hex: '#FFD700', rgb: [255, 215, 0] },
  { id: 'S010', name: '黄', nameEn: 'Yellow', hex: '#FFFF00', rgb: [255, 255, 0] },
  { id: 'S011', name: '柠檬黄', nameEn: 'Lemon', hex: '#FFFACD', rgb: [255, 250, 205] },
  { id: 'S012', name: '浅绿', nameEn: 'Light Green', hex: '#90EE90', rgb: [144, 238, 144] },
  { id: 'S013', name: '绿', nameEn: 'Green', hex: '#00FF00', rgb: [0, 255, 0] },
  { id: 'S014', name: '深绿', nameEn: 'Dark Green', hex: '#006400', rgb: [0, 100, 0] },
  { id: 'S015', name: '薄荷', nameEn: 'Mint', hex: '#98FF98', rgb: [152, 255, 152] },
  { id: 'S016', name: '蓝绿', nameEn: 'Teal', hex: '#008080', rgb: [0, 128, 128] },
  { id: 'S017', name: '浅蓝', nameEn: 'Light Blue', hex: '#ADD8E6', rgb: [173, 216, 230] },
  { id: 'S018', name: '天蓝', nameEn: 'Sky Blue', hex: '#87CEEB', rgb: [135, 206, 235] },
  { id: 'S019', name: '蓝', nameEn: 'Blue', hex: '#0000FF', rgb: [0, 0, 255] },
  { id: 'S020', name: '深蓝', nameEn: 'Dark Blue', hex: '#00008B', rgb: [0, 0, 139] },
  { id: 'S021', name: '靛蓝', nameEn: 'Indigo', hex: '#4B0082', rgb: [75, 0, 130] },
  { id: 'S022', name: '紫', nameEn: 'Purple', hex: '#800080', rgb: [128, 0, 128] },
  { id: 'S023', name: '浅紫', nameEn: 'Light Purple', hex: '#DDA0DD', rgb: [221, 160, 221] },
  { id: 'S024', name: '紫红', nameEn: 'Fuchsia', hex: '#FF00FF', rgb: [255, 0, 255] },
  { id: 'S025', name: '棕', nameEn: 'Brown', hex: '#A0522D', rgb: [160, 82, 45] },
  { id: 'S026', name: '深棕', nameEn: 'Dark Brown', hex: '#8B4513', rgb: [139, 69, 19] },
  { id: 'S027', name: '灰', nameEn: 'Gray', hex: '#808080', rgb: [128, 128, 128] },
  { id: 'S028', name: '深灰', nameEn: 'Dark Gray', hex: '#696969', rgb: [105, 105, 105] },
  { id: 'S029', name: '黑', nameEn: 'Black', hex: '#000000', rgb: [0, 0, 0] },
  { id: 'S030', name: '肤色', nameEn: 'Peach', hex: '#FFDAB9', rgb: [255, 218, 185] },
];

export const ARTKAL_PALETTE: Palette = {
  id: 'artkal_s',
  brand: 'Artkal',
  brandCn: 'Artkal S',
  code: 'ARTKAL_S',
  beadSize: '5mm',
  colors: ARTKAL_COLORS
};

export const PALETTES: Palette[] = [PERLER_PALETTE, ARTKAL_PALETTE];

export const DEFAULT_PALETTE = PERLER_PALETTE;
