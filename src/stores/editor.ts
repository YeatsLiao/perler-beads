import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { DEFAULT_PALETTE } from '@/constants/palettes';
import type { Palette, ToolType } from '@/types';

export const useEditorStore = defineStore('editor', () => {
  const currentPalette = ref<Palette>(DEFAULT_PALETTE);
  const currentTool = ref<ToolType>('pen');
  const currentColor = ref('#000000');
  const canvasWidth = ref(29);
  const canvasHeight = ref(29);
  const pixelSize = ref(10);

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
  }

  function setCanvasSize(width: number, height: number) {
    canvasWidth.value = width;
    canvasHeight.value = height;
  }

  function setPixelSize(size: number) {
    pixelSize.value = size;
  }

  return {
    currentPalette,
    currentTool,
    currentColor,
    canvasWidth,
    canvasHeight,
    pixelSize,
    availableTools,
    setPalette,
    setTool,
    setColor,
    setCanvasSize,
    setPixelSize
  };
});
