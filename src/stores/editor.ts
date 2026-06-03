import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DEFAULT_PALETTE } from '@/constants/palettes';
import type { Palette, ToolType } from '@/types';
import type { PixelPattern } from '@/utils/demoWorks';
import { ColorCounter } from '@/utils/colorCounter';
import { draftStorage } from '@/utils/draftStorage';

const colorCounter = new ColorCounter();

function createBlankPixels(width: number, height: number): PixelPattern {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => null));
}

function clonePixels(pixels: PixelPattern): PixelPattern {
  return pixels.map(row => [...row]);
}

export const useEditorStore = defineStore('editor', () => {
  const currentPalette = ref<Palette>(DEFAULT_PALETTE);
  const currentTool = ref<ToolType>('pen');
  const currentColor = ref('#4A3728');
  const canvasWidth = ref(29);
  const canvasHeight = ref(29);
  const pixelSize = ref(10);
  const pixels = ref<PixelPattern>(createBlankPixels(29, 29));
  const history = ref<PixelPattern[]>([clonePixels(pixels.value)]);
  const historyIndex = ref(0);
  const draftId = ref('');

  const availableTools: { type: ToolType; name: string; icon: string }[] = [
    { type: 'pen', name: '画笔', icon: '✏️' },
    { type: 'fill', name: '填充', icon: '🪣' },
    { type: 'eyedropper', name: '吸管', icon: '💉' },
    { type: 'eraser', name: '橡皮擦', icon: '🧹' }
  ];

  function setPalette(palette: Palette) {
    currentPalette.value = palette;
  }

  function setTool(tool: ToolType) {
    currentTool.value = tool;
  }

  function setColor(color: string) {
    currentColor.value = color;
    persistDraft();
  }

  function setCanvasSize(width: number, height: number) {
    canvasWidth.value = width;
    canvasHeight.value = height;
    pixels.value = createBlankPixels(width, height);
    resetHistory();
    draftId.value = '';
  }

  function setPixelSize(size: number) {
    pixelSize.value = size;
  }

  function loadPixels(nextPixels: PixelPattern) {
    pixels.value = clonePixels(nextPixels);
    canvasHeight.value = nextPixels.length;
    canvasWidth.value = nextPixels[0]?.length || 0;
    resetHistory();
    persistDraft();
  }

  function paintPixel(x: number, y: number, color = currentColor.value) {
    if (!isInBounds(x, y)) return;
    const next = clonePixels(pixels.value);
    next[y][x] = currentTool.value === 'eraser' ? null : color;
    pixels.value = next;
    pushHistory();
    persistDraft();
  }

  function dragPixel(x: number, y: number, color = currentColor.value) {
    if (!isInBounds(x, y)) return;
    const nextValue = currentTool.value === 'eraser' ? null : color;
    if (pixels.value[y][x] === nextValue) return;
    const next = clonePixels(pixels.value);
    next[y][x] = nextValue;
    pixels.value = next;
  }

  function commitDrag() {
    const currentSnapshot = JSON.stringify(pixels.value);
    const lastSnapshot = JSON.stringify(history.value[historyIndex.value]);
    if (currentSnapshot !== lastSnapshot) {
      pushHistory();
    }
    persistDraft();
  }

  function fillPixel(x: number, y: number) {
    if (!isInBounds(x, y)) return;
    const targetColor = pixels.value[y][x];
    const fillColor = currentTool.value === 'eraser' ? null : currentColor.value;
    if (targetColor === fillColor) return;

    const next = clonePixels(pixels.value);
    const stack: [number, number][] = [[x, y]];

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      if (cx < 0 || cx >= canvasWidth.value || cy < 0 || cy >= canvasHeight.value) continue;
      if (next[cy][cx] !== targetColor) continue;
      next[cy][cx] = fillColor;
      stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
    }

    pixels.value = next;
    pushHistory();
    persistDraft();
  }

  function pickPixel(x: number, y: number) {
    if (!isInBounds(x, y)) return;
    const picked = pixels.value[y][x];
    if (picked) setColor(picked);
  }

  function undo() {
    if (historyIndex.value <= 0) return;
    historyIndex.value -= 1;
    pixels.value = clonePixels(history.value[historyIndex.value]);
    persistDraft();
  }

  function redo() {
    if (historyIndex.value >= history.value.length - 1) return;
    historyIndex.value += 1;
    pixels.value = clonePixels(history.value[historyIndex.value]);
    persistDraft();
  }

  function saveDraft() {
    const id = draftId.value || `draft_${Date.now()}`;
    if (!draftId.value) draftId.value = id;

    draftStorage.saveCurrentDraft({
      width: canvasWidth.value,
      height: canvasHeight.value,
      pixels: pixels.value,
      currentColor: currentColor.value,
      paletteId: currentPalette.value.id
    });

    draftStorage.saveDraft({
      _id: id,
      title: `图纸 ${canvasWidth.value}×${canvasHeight.value}`,
      width: canvasWidth.value,
      height: canvasHeight.value,
      pixels: clonePixels(pixels.value),
      paletteId: currentPalette.value.id,
      currentColor: currentColor.value,
      updatedAt: Date.now(),
      createdAt: Date.now()
    });

    persistDraft();
  }

  function restoreDraft(): boolean {
    try {
      const draft = draftStorage.loadCurrentDraft();
      if (!draft) return false;
      pixels.value = clonePixels(draft.pixels);
      canvasWidth.value = draft.width;
      canvasHeight.value = draft.height;
      currentColor.value = draft.currentColor;
      resetHistory();
      return true;
    } catch (_) {
      return false;
    }
  }

  function loadDraft(id: string): boolean {
    try {
      const draft = draftStorage.loadDraft(id);
      if (!draft) return false;
      pixels.value = clonePixels(draft.pixels);
      canvasWidth.value = draft.width;
      canvasHeight.value = draft.height;
      currentColor.value = draft.currentColor || currentColor.value;
      draftId.value = draft._id;
      resetHistory();
      persistDraft();
      return true;
    } catch (_) {
      return false;
    }
  }

  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);
  const usedColors = computed(() => new Set(pixels.value.flat().filter(Boolean)).size);
  const beadCount = computed(() => pixels.value.flat().filter(Boolean).length);

  const materialStats = computed(() => {
    const stats = colorCounter.countColors(pixels.value, currentPalette.value);
    return stats.map(s => ({
      hex: s.hex,
      count: s.count,
      colorName: s.colorName,
      colorId: s.colorId,
      percentage: s.percentage
    }));
  });

  function isInBounds(x: number, y: number) {
    return x >= 0 && y >= 0 && x < canvasWidth.value && y < canvasHeight.value;
  }

  function pushHistory() {
    const nextHistory = history.value.slice(0, historyIndex.value + 1);
    nextHistory.push(clonePixels(pixels.value));
    if (nextHistory.length > 40) nextHistory.shift();
    history.value = nextHistory;
    historyIndex.value = history.value.length - 1;
  }

  function resetHistory() {
    history.value = [clonePixels(pixels.value)];
    historyIndex.value = 0;
  }

  function persistDraft() {
    try {
      draftStorage.saveCurrentDraft({
        width: canvasWidth.value,
        height: canvasHeight.value,
        pixels: pixels.value,
        currentColor: currentColor.value,
        paletteId: currentPalette.value.id
      });
    } catch (_) {}
  }

  return {
    currentPalette,
    currentTool,
    currentColor,
    canvasWidth,
    canvasHeight,
    pixelSize,
    pixels,
    canUndo,
    canRedo,
    usedColors,
    beadCount,
    materialStats,
    availableTools,
    draftId,
    setPalette,
    setTool,
    setColor,
    setCanvasSize,
    setPixelSize,
    loadPixels,
    paintPixel,
    dragPixel,
    commitDrag,
    fillPixel,
    pickPixel,
    undo,
    redo,
    saveDraft,
    restoreDraft,
    loadDraft
  };
});
