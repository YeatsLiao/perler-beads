import type { ExportOptions, Palette } from '@/types';
import { getPlatformAdapter, type OffscreenCanvasContext } from '@/utils/platformAdapter';

export class ExportService {
  async export(
    pixels: (string | null)[][],
    palette: Palette,
    options: ExportOptions
  ): Promise<string> {
    const adapter = getPlatformAdapter();
    const canvasCtx = this.createExportCanvas(pixels, palette, options, adapter);
    const mimeType = options.format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = options.quality !== undefined ? options.quality / 100 : 0.92;
    return canvasCtx.toDataURL(mimeType, quality);
  }

  private createExportCanvas(
    pixels: (string | null)[][],
    palette: Palette,
    options: ExportOptions,
    adapter: ReturnType<typeof getPlatformAdapter>
  ): OffscreenCanvasContext {
    const width = pixels[0].length * options.scale;
    const height = pixels.length * options.scale;
    const canvasCtx = adapter.createOffscreenCanvas(width, height);
    const ctx = canvasCtx.getContext2d();

    if (options.background === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    if (options.flipHorizontal) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    for (let y = 0; y < pixels.length; y++) {
      for (let x = 0; x < pixels[y].length; x++) {
        const color = pixels[y][x];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x * options.scale, y * options.scale, options.scale, options.scale);
        }
      }
    }

    if (options.showGrid) {
      ctx.strokeStyle = '#D9CABC';
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

    if (options.showColorId) {
      const colorIndexMap = new Map<string, number>();
      let idx = 1;
      for (const color of palette.colors) {
        colorIndexMap.set(color.hex, idx++);
      }
      ctx.fillStyle = '#4A3728';
      ctx.font = `${Math.max(8, options.scale * 0.4)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < pixels.length; y++) {
        for (let x = 0; x < pixels[y].length; x++) {
          const color = pixels[y][x];
          if (color) {
            const colorIdx = colorIndexMap.get(color) || 0;
            ctx.fillText(String(colorIdx), x * options.scale + options.scale / 2, y * options.scale + options.scale / 2);
          }
        }
      }
    }

    return canvasCtx;
  }
}
