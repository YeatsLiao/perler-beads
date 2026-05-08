import type { Palette, ColorEntry } from '@/types';

interface ColorStats {
  colorId: string;
  colorName: string;
  hex: string;
  count: number;
  percentage: number;
  beadCount: number;
}

interface MaterialItem {
  colorId: string;
  colorName: string;
  hex: string;
  quantity: number;
  unit: string;
}

export class ColorCounter {
  countColors(pixels: (string | null)[][], palette: Palette): ColorStats[] {
    const colorMap = new Map<string, number>();
    let totalPixels = 0;

    for (const row of pixels) {
      for (const color of row) {
        if (color) {
          const count = colorMap.get(color) || 0;
          colorMap.set(color, count + 1);
          totalPixels++;
        }
      }
    }

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
          percentage: totalPixels > 0 ? Math.round((count / totalPixels) * 10000) / 100 : 0,
          beadCount: count
        });
      }
    }

    return stats.sort((a, b) => b.count - a.count);
  }

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
