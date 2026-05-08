import type { Palette, ColorEntry } from '@/types';

export class PixelProcessor {
  private palette: ColorEntry[];

  constructor(palette: ColorEntry[]) {
    this.palette = palette;
  }

  matchColor(rgb: [number, number, number]): ColorEntry {
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

  async pixelate(
    imageData: Uint8ClampedArray,
    width: number,
    height: number,
    pixelSize: number
  ): Promise<string[][]> {
    const result: string[][] = [];

    for (let y = 0; y < height; y += pixelSize) {
      const row: string[] = [];
      for (let x = 0; x < width; x += pixelSize) {
        const color = this.calculateBlockColor(imageData, width, x, y, pixelSize);
        const matched = this.matchColor([color.r, color.g, color.b]);
        row.push(matched.hex);
      }
      result.push(row);
    }

    return result;
  }

  private calculateBlockColor(
    data: Uint8ClampedArray,
    width: number,
    startX: number,
    startY: number,
    blockSize: number
  ) {
    let r = 0, g = 0, b = 0;
    let count = 0;

    const endX = Math.min(startX + blockSize, width);
    const endY = Math.min(startY + blockSize, Math.floor(data.length / (width * 4)));

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const index = (y * width + x) * 4;
        r += data[index];
        g += data[index + 1];
        b += data[index + 2];
        count++;
      }
    }

    return {
      r: Math.round(r / count),
      g: Math.round(g / count),
      b: Math.round(b / count)
    };
  }

  adjustBrightness(data: Uint8ClampedArray, value: number): Uint8ClampedArray {
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
