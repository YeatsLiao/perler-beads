export interface OffscreenCanvasContext {
  canvas: any;
  setWidth(width: number): void;
  setHeight(height: number): void;
  getContext2d(): any;
  toDataURL(type?: string, quality?: number): string;
}

export interface PlatformAdapter {
  getImageData(src: string, width: number, height: number): Promise<Uint8ClampedArray>;
  createOffscreenCanvas(width: number, height: number): OffscreenCanvasContext;
  saveImage(dataUrl: string, filename: string): Promise<void>;
}

// #ifdef H5
class H5Adapter implements PlatformAdapter {
  async getImageData(src: string, width: number, height: number): Promise<Uint8ClampedArray> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('canvas unavailable'));
          return;
        }
        ctx.drawImage(image, 0, 0, width, height);
        resolve(ctx.getImageData(0, 0, width, height).data);
      };
      image.onerror = reject;
      image.src = src;
    });
  }

  createOffscreenCanvas(width: number, height: number): OffscreenCanvasContext {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return {
      canvas,
      setWidth(w: number) { canvas.width = w; },
      setHeight(h: number) { canvas.height = h; },
      getContext2d() { return canvas.getContext('2d')!; },
      toDataURL(type = 'image/png', quality = 0.92) { return canvas.toDataURL(type, quality); }
    };
  }

  async saveImage(dataUrl: string, filename: string): Promise<void> {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }
}
// #endif

// #ifdef MP-WEIXIN
class WechatAdapter implements PlatformAdapter {
  async getImageData(src: string, width: number, height: number): Promise<Uint8ClampedArray> {
    return new Promise((resolve, reject) => {
      const canvas = uni.createOffscreenCanvas({ type: '2d', width, height });
      const ctx = canvas.getContext('2d');
      const image = canvas.createImage();
      image.onload = () => {
        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        resolve(imageData.data as Uint8ClampedArray);
      };
      image.onerror = reject;
      image.src = src;
    });
  }

  createOffscreenCanvas(width: number, height: number): OffscreenCanvasContext {
    const canvas = uni.createOffscreenCanvas({ type: '2d', width, height });
    return {
      canvas,
      setWidth(w: number) { canvas.width = w; },
      setHeight(h: number) { canvas.height = h; },
      getContext2d() { return canvas.getContext('2d'); },
      toDataURL(type = 'image/png', quality = 0.92) {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const tempCanvas = uni.createOffscreenCanvas({ type: '2d', width: canvas.width, height: canvas.height });
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);
        return tempCanvas.toDataURL(type, quality);
      }
    };
  }

  async saveImage(dataUrl: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fs = uni.getFileSystemManager();
      const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      const filePath = `${wx.env.USER_DATA_PATH}/${filename}`;
      try {
        fs.writeFileSync(filePath, base64, 'base64');
        uni.saveImageFileToPhotosAlbum({
          filePath,
          success: () => resolve(),
          fail: (err: any) => reject(err)
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
// #endif

// #ifdef APP-PLUS
class AppAdapter implements PlatformAdapter {
  async getImageData(src: string, width: number, height: number): Promise<Uint8ClampedArray> {
    return new Promise((resolve, reject) => {
      const canvas = uni.createOffscreenCanvas({ type: '2d', width, height });
      const ctx = canvas.getContext('2d');
      const image = canvas.createImage();
      image.onload = () => {
        ctx.drawImage(image, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        resolve(imageData.data as Uint8ClampedArray);
      };
      image.onerror = reject;
      image.src = src;
    });
  }

  createOffscreenCanvas(width: number, height: number): OffscreenCanvasContext {
    const canvas = uni.createOffscreenCanvas({ type: '2d', width, height });
    return {
      canvas,
      setWidth(w: number) { canvas.width = w; },
      setHeight(h: number) { canvas.height = h; },
      getContext2d() { return canvas.getContext('2d'); },
      toDataURL(type = 'image/png', quality = 0.92) { return canvas.toDataURL(type, quality); }
    };
  }

  async saveImage(dataUrl: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const fs = uni.getFileSystemManager();
      const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      const filePath = `_doc/${filename}`;
      try {
        fs.writeFileSync(filePath, base64, 'base64');
        uni.saveImageFileToPhotosAlbum({
          filePath,
          success: () => resolve(),
          fail: (err: any) => reject(err)
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}
// #endif

let adapterInstance: PlatformAdapter | null = null;

export function getPlatformAdapter(): PlatformAdapter {
  if (adapterInstance) return adapterInstance;

  // #ifdef H5
  adapterInstance = new H5Adapter();
  // #endif

  // #ifdef MP-WEIXIN
  adapterInstance = new WechatAdapter();
  // #endif

  // #ifdef APP-PLUS
  adapterInstance = new AppAdapter();
  // #endif

  if (!adapterInstance) {
    // Fallback for unknown platforms - use H5-like approach
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      adapterInstance = new H5Adapter();
    } catch (_) {
      throw new Error('No platform adapter available');
    }
  }

  return adapterInstance!;
}
