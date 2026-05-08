import type { ExportOptions, Palette } from '@/types';

export class ExportService {
  async export(
    pixels: (string | null)[][],
    palette: Palette,
    options: ExportOptions
  ): Promise<string> {
    const canvas = this.createExportCanvas(pixels, options);
    const mimeType = options.format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = options.quality !== undefined ? options.quality / 100 : 0.92;
    const dataUrl = canvas.toDataURL(mimeType, quality);

    return dataUrl;
  }

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

    if (options.background === 'white') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
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

    if (options.flipHorizontal) {
      const flippedCanvas = document.createElement('canvas');
      flippedCanvas.width = width;
      flippedCanvas.height = height;
      const flippedCtx = flippedCanvas.getContext('2d')!;
      flippedCtx.translate(width, 0);
      flippedCtx.scale(-1, 1);
      flippedCtx.drawImage(canvas, 0, 0);
      return flippedCanvas;
    }

    return canvas;
  }
}
