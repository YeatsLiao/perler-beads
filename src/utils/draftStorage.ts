import type { PixelPattern } from '@/utils/demoWorks';

export interface DraftData {
  _id: string;
  title: string;
  width: number;
  height: number;
  pixels: PixelPattern;
  paletteId: string;
  currentColor: string;
  thumbnail?: string;
  updatedAt: number;
  createdAt: number;
}

const CURRENT_SKETCH_KEY = 'currentSketch';
const DRAFTS_LIST_KEY = 'drafts_list';

function clonePixels(pixels: PixelPattern): PixelPattern {
  return pixels.map(row => [...row]);
}

class DraftStorage {
  saveCurrentDraft(data: {
    width: number;
    height: number;
    pixels: PixelPattern;
    currentColor: string;
    paletteId?: string;
  }): void {
    try {
      uni.setStorageSync(CURRENT_SKETCH_KEY, {
        width: data.width,
        height: data.height,
        pixels: clonePixels(data.pixels),
        currentColor: data.currentColor,
        paletteId: data.paletteId || 'perler_80',
        updatedAt: Date.now()
      });
    } catch (_) {}
  }

  loadCurrentDraft(): DraftData | null {
    try {
      const draft = uni.getStorageSync(CURRENT_SKETCH_KEY);
      if (!draft?.pixels?.length) return null;
      return {
        _id: 'current',
        title: `图纸 ${draft.width}×${draft.height}`,
        width: draft.width || draft.pixels[0]?.length || 0,
        height: draft.height || draft.pixels.length || 0,
        pixels: clonePixels(draft.pixels),
        paletteId: draft.paletteId || 'perler_80',
        currentColor: draft.currentColor || '#000000',
        updatedAt: draft.updatedAt || Date.now(),
        createdAt: draft.updatedAt || Date.now()
      };
    } catch (_) {
      return null;
    }
  }

  saveDraft(draft: DraftData): void {
    try {
      const list = this.getDraftsList();
      const existingIndex = list.findIndex(d => d._id === draft._id);
      const entry = {
        _id: draft._id,
        title: draft.title,
        width: draft.width,
        height: draft.height,
        paletteId: draft.paletteId,
        currentColor: draft.currentColor,
        updatedAt: Date.now(),
        createdAt: draft.createdAt || Date.now()
      };

      if (existingIndex !== -1) {
        list[existingIndex] = entry;
      } else {
        list.unshift(entry);
      }

      uni.setStorageSync(DRAFTS_LIST_KEY, list);
      uni.setStorageSync(`draft_${draft._id}`, clonePixels(draft.pixels));
    } catch (_) {}
  }

  loadAllDrafts(): DraftData[] {
    try {
      const list = this.getDraftsList();
      return list
        .map(entry => {
          try {
            const pixels = uni.getStorageSync(`draft_${entry._id}`);
            if (!pixels?.length) return null;
            return {
              _id: entry._id,
              title: entry.title,
              width: entry.width,
              height: entry.height,
              pixels: clonePixels(pixels),
              paletteId: entry.paletteId,
              currentColor: entry.currentColor,
              updatedAt: entry.updatedAt,
              createdAt: entry.createdAt
            } as DraftData;
          } catch (_) {
            return null;
          }
        })
        .filter((d): d is DraftData => d !== null);
    } catch (_) {
      return [];
    }
  }

  loadDraft(id: string): DraftData | null {
    try {
      const list = this.getDraftsList();
      const entry = list.find(d => d._id === id);
      if (!entry) return null;
      const pixels = uni.getStorageSync(`draft_${id}`);
      if (!pixels?.length) return null;
      return {
        _id: entry._id,
        title: entry.title,
        width: entry.width,
        height: entry.height,
        pixels: clonePixels(pixels),
        paletteId: entry.paletteId,
        currentColor: entry.currentColor,
        updatedAt: entry.updatedAt,
        createdAt: entry.createdAt
      };
    } catch (_) {
      return null;
    }
  }

  deleteDraft(id: string): void {
    try {
      const list = this.getDraftsList();
      const filtered = list.filter(d => d._id !== id);
      uni.setStorageSync(DRAFTS_LIST_KEY, filtered);
      uni.removeStorageSync(`draft_${id}`);
    } catch (_) {}
  }

  private getDraftsList(): Array<{
    _id: string;
    title: string;
    width: number;
    height: number;
    paletteId: string;
    currentColor: string;
    updatedAt: number;
    createdAt: number;
  }> {
    try {
      const list = uni.getStorageSync(DRAFTS_LIST_KEY);
      if (!Array.isArray(list)) return [];
      return list;
    } catch (_) {
      return [];
    }
  }
}

export const draftStorage = new DraftStorage();
