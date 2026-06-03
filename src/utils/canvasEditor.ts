import type { ToolType, EditorOptions } from '@/types';

export class CanvasEditor {
  private pixels: (string | null)[][];
  private history: string[][][];
  private historyIndex: number;
  private currentTool: ToolType;
  private currentColor: string;
  private scale: number;
  private offsetX: number;
  private offsetY: number;
  private _width: number;
  private _height: number;

  constructor(options: EditorOptions) {
    this._width = options.width;
    this._height = options.height;
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

  getPixels(): (string | null)[][] {
    return this.pixels;
  }

  getWidth(): number {
    return this._width;
  }

  getHeight(): number {
    return this._height;
  }

  getHistoryIndex(): number {
    return this.historyIndex;
  }

  getHistoryLength(): number {
    return this.history.length;
  }

  getCurrentColor(): string {
    return this.currentColor;
  }

  loadPixels(pixels: (string | null)[][]): void {
    this.pixels = JSON.parse(JSON.stringify(pixels));
    this._height = pixels.length;
    this._width = pixels[0]?.length || 0;
    this.history = [JSON.parse(JSON.stringify(this.pixels))];
    this.historyIndex = 0;
  }

  setTool(tool: ToolType) {
    this.currentTool = tool;
  }

  setColor(color: string) {
    this.currentColor = color;
  }

  useTool(x: number, y: number, action: 'start' | 'move' | 'end') {
    const gridX = Math.floor((x - this.offsetX) / this.scale);
    const gridY = Math.floor((y - this.offsetY) / this.scale);

    if (gridX < 0 || gridX >= this.pixels[0].length || gridY < 0 || gridY >= this.pixels.length) {
      return;
    }

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

  drawPixelDirect(x: number, y: number, color: string | null): void {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) return;
    this.pixels[y][x] = color;
  }

  commitDirect(): void {
    this.saveHistory();
  }

  floodFillDirect(x: number, y: number, fillColor: string | null): void {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) return;
    const targetColor = this.pixels[y][x];
    if (targetColor === fillColor) return;

    const stack = [[x, y]];
    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      if (cx < 0 || cx >= this._width || cy < 0 || cy >= this._height) continue;
      if (this.pixels[cy][cx] !== targetColor) continue;
      this.pixels[cy][cx] = fillColor;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }
    this.saveHistory();
  }

  pickColorDirect(x: number, y: number): string | null {
    if (x < 0 || x >= this._width || y < 0 || y >= this._height) return null;
    return this.pixels[y][x];
  }

  private drawPixel(x: number, y: number) {
    if (this.pixels[y][x] !== this.currentColor) {
      this.pixels[y][x] = this.currentColor;
      this.saveHistory();
    }
  }

  private erasePixel(x: number, y: number) {
    if (this.pixels[y][x] !== null) {
      this.pixels[y][x] = null;
      this.saveHistory();
    }
  }

  private pickColor(x: number, y: number) {
    const color = this.pixels[y][x];
    if (color) {
      this.currentColor = color;
    }
  }

  private floodFill(startX: number, startY: number) {
    const targetColor = this.pixels[startY]?.[startX];
    if (targetColor === this.currentColor || targetColor === null) return;

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
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.pixels = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.pixels = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
    }
  }

  private saveHistory() {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(JSON.parse(JSON.stringify(this.pixels)));
    this.historyIndex = this.history.length - 1;

    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }
  }

  resize(width: number, height: number) {
    const newPixels: (string | null)[][] = Array(height).fill(null).map(() => Array(width).fill(null));
    
    for (let y = 0; y < Math.min(this.pixels.length, height); y++) {
      for (let x = 0; x < Math.min(this.pixels[0].length, width); x++) {
        newPixels[y][x] = this.pixels[y][x];
      }
    }
    
    this._width = width;
    this._height = height;
    this.pixels = newPixels;
    this.saveHistory();
  }
}
