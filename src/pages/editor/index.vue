<template>
  <view class="editor-page">
    <view class="topbar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="icon-btn" @click="handleBack">‹</view>
      <view class="title">
        <text>编辑图纸</text>
        <text>{{ store.canvasWidth }}×{{ store.canvasHeight }} · {{ modeLabel }}</text>
      </view>
      <view class="top-actions">
        <view class="icon-btn" :class="{ disabled: !store.canUndo }" @click="store.undo()">↶</view>
        <view class="icon-btn" :class="{ disabled: !store.canRedo }" @click="store.redo()">↷</view>
        <view class="export-btn" @click="handleExport">导出</view>
      </view>
    </view>

    <view class="mode-row">
      <view
        v-for="item in modes"
        :key="item.value"
        class="mode-btn"
        :class="{ active: workMode === item.value }"
        @click="workMode = item.value"
      >{{ item.label }}</view>
    </view>

    <view class="tool-row">
      <view
        v-for="tool in tools"
        :key="tool.type"
        class="tool-btn"
        :class="{ active: store.currentTool === tool.type }"
        @click="store.setTool(tool.type)"
      >
        <text>{{ tool.icon }}</text>
        <text>{{ tool.name }}</text>
      </view>
    </view>

    <view class="canvas-area">
      <view
        class="pixel-board"
        :style="boardStyle"
        @mousedown="handlePointerStart"
        @mousemove="handlePointerMove"
        @mouseup="handlePointerEnd"
        @mouseleave="handlePointerEnd"
        @touchstart.prevent="handlePointerStart"
        @touchmove.prevent="handlePointerMove"
        @touchend="handlePointerEnd"
      >
        <view
          v-for="(_, index) in topNumbers"
          :key="`top-${index}`"
          class="axis top-axis"
          :style="{ gridColumn: index + 2, gridRow: 1 }"
        >{{ index + 1 }}</view>
        <view
          v-for="(_, index) in sideNumbers"
          :key="`side-${index}`"
          class="axis side-axis"
          :style="{ gridColumn: 1, gridRow: index + 2 }"
        >{{ index + 1 }}</view>
        <view
          v-for="(cell, index) in flatPixels"
          :key="index"
          class="pixel-cell"
          :class="{ empty: !cell, muted: isMuted(cell) }"
          :style="cellStyle(cell, index)"
        ></view>
      </view>
    </view>

    <view class="bottom-panel">
      <view class="status-row">
        <view>
          <text>{{ store.beadCount }}</text>
          <text>颗</text>
        </view>
        <view>
          <text>{{ store.usedColors }}</text>
          <text>色</text>
        </view>
        <view class="current-color" :style="{ background: store.currentColor }"></view>
        <view class="save-btn" @click="handleSave">保存</view>
      </view>

      <scroll-view scroll-x class="palette-scroll">
        <view class="palette-list">
          <view
            v-for="color in paletteColors"
            :key="color.id"
            class="palette-color"
            :class="{ active: store.currentColor === color.hex }"
            @click="store.setColor(color.hex)"
          >
            <view :style="{ background: color.hex }"></view>
          </view>
        </view>
      </scroll-view>

      <scroll-view scroll-x class="material-scroll">
        <view class="material-list">
          <view
            v-for="item in store.materialStats"
            :key="item.hex"
            class="material-chip"
            :class="{ active: focusColor === item.hex }"
            @click="toggleFocus(item.hex)"
          >
            <view :style="{ background: item.hex }"></view>
            <text>{{ item.count }}</text>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { catPattern, getDemoWork } from '@/utils/demoWorks';
import { draftStorage } from '@/utils/draftStorage';
import type { ToolType } from '@/types';

const store = useEditorStore();
const statusBarHeight = ref(0);
const drawing = ref(false);
const workMode = ref<'draw' | 'bead'>('draw');
const focusColor = ref('');
const lastPointerType = ref<'touch' | 'mouse' | ''>('');
const lastDragTime = ref(0);
const DRAG_THROTTLE_MS = 16;
const currentDraftId = ref('');
const draftCreatedAt = ref(0);

const tools = [
  { type: 'pen' as ToolType, name: '画笔', icon: '✎' },
  { type: 'fill' as ToolType, name: '填充', icon: '■' },
  { type: 'eraser' as ToolType, name: '橡皮', icon: '⌫' },
  { type: 'eyedropper' as ToolType, name: '取色', icon: '◎' }
];

const flatPixels = computed(() => store.pixels.flat());
const paletteColors = computed(() => store.currentPalette.colors.slice(0, 24));
const topNumbers = computed(() => Array.from({ length: store.canvasWidth }));
const sideNumbers = computed(() => Array.from({ length: store.canvasHeight }));
const boardStyle = computed(() => ({
  '--cols': store.canvasWidth,
  '--rows': store.canvasHeight,
  '--board-cols': store.canvasWidth + 1,
  '--board-rows': store.canvasHeight + 1
}));
const modes = [
  { label: '绘图', value: 'draw' as const },
  { label: '摆豆', value: 'bead' as const }
];
const modeLabel = computed(() => workMode.value === 'draw' ? '绘图' : '摆豆');

const boardRect = ref({ left: 0, top: 0, width: 0, height: 0 });

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 0;
    }
  });

  nextTick(() => {
    updateBoardRect();
  });

  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any).$page?.options || {};

  if (options.width && options.height) {
    store.setCanvasSize(Number(options.width), Number(options.height));
  } else if (options.source === 'generate') {
    if (store.beadCount === 0) {
      store.restoreDraft();
    }
  } else if (options.source === 'draft' && options.id) {
    const draft = draftStorage.loadDraft(options.id);
    if (draft) {
      store.loadPixels(draft.pixels);
      currentDraftId.value = draft._id;
      draftCreatedAt.value = draft.createdAt;
      store.draftId = draft._id;
    }
  } else if (options.id) {
    const normalized = String(options.id).replace('draft-', '').replace('sketch-', '');
    const demo = getDemoWork(normalized);
    if (demo) {
      store.loadPixels(demo.pattern);
    }
  } else if (store.beadCount === 0) {
    if (!store.restoreDraft()) {
      store.loadPixels(catPattern);
    }
  }
});

function updateBoardRect() {
  const query = uni.createSelectorQuery();
  query.select('.pixel-board').boundingClientRect((rect: any) => {
    if (rect) {
      boardRect.value = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    }
  }).exec();
}

function handlePointerStart(event: MouseEvent | TouchEvent) {
  if ('touches' in event) {
    lastPointerType.value = 'touch';
  } else {
    if (lastPointerType.value === 'touch') return;
    lastPointerType.value = 'mouse';
  }
  if (!boardRect.value.width) {
    updateBoardRect();
  }
  drawing.value = true;
  applyTool(event, true);
}

function handlePointerMove(event: MouseEvent | TouchEvent) {
  if (!drawing.value) return;
  if ('touches' in event) {
    lastPointerType.value = 'touch';
  } else {
    if (lastPointerType.value === 'touch') return;
    lastPointerType.value = 'mouse';
  }
  const now = Date.now();
  if (now - lastDragTime.value < DRAG_THROTTLE_MS) return;
  lastDragTime.value = now;
  applyTool(event, false);
}

function handlePointerEnd() {
  if (!drawing.value) return;
  drawing.value = false;
  lastPointerType.value = '';
  if (store.currentTool === 'pen' || store.currentTool === 'eraser') {
    store.commitDrag();
  }
}

function applyTool(event: MouseEvent | TouchEvent, isStart: boolean) {
  const point = getBoardPoint(event);
  if (!point) return;

  if (store.currentTool === 'fill' && isStart) {
    store.fillPixel(point.x, point.y);
    drawing.value = false;
    return;
  }

  if (store.currentTool === 'eyedropper' && isStart) {
    store.pickPixel(point.x, point.y);
    drawing.value = false;
    return;
  }

  if (store.currentTool === 'pen' || store.currentTool === 'eraser') {
    store.dragPixel(point.x, point.y);
  }
}

function cellStyle(cell: string | null, index: number) {
  const x = index % store.canvasWidth;
  const y = Math.floor(index / store.canvasWidth);
  return {
    background: cell || '#FFFDF9',
    gridColumn: x + 2,
    gridRow: y + 2
  };
}

function isMuted(cell: string | null) {
  return workMode.value === 'bead' && !!focusColor.value && cell !== focusColor.value;
}

function toggleFocus(hex: string) {
  focusColor.value = focusColor.value === hex ? '' : hex;
}

function getBoardPoint(event: MouseEvent | TouchEvent) {
  let clientX: number, clientY: number;
  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0];
    if (!touch) return null;
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const rect = boardRect.value;
  if (!rect.width || !rect.height) return null;

  const relX = clientX - rect.left;
  const relY = clientY - rect.top;

  const axisRatioX = 28 / (rect.width);
  const axisRatioY = 28 / (rect.height);
  const gridRelX = relX / rect.width - axisRatioX;
  const gridRelY = relY / rect.height - axisRatioY;
  const gridWidth = 1 - axisRatioX;
  const gridHeight = 1 - axisRatioY;

  if (gridRelX < 0 || gridRelY < 0) return null;

  const x = Math.floor((gridRelX / gridWidth) * store.canvasWidth);
  const y = Math.floor((gridRelY / gridHeight) * store.canvasHeight);
  if (x < 0 || y < 0 || x >= store.canvasWidth || y >= store.canvasHeight) return null;
  return { x, y };
}

function handleBack() {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/create/index' });
    }
  });
}

function handleSave() {
  store.saveDraft();
  uni.showToast({ title: '已保存', icon: 'success' });
}

function handleExport() {
  uni.navigateTo({ url: '/pages/export/index' });
}
</script>

<style lang="scss" scoped>
.editor-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F8F1EA;
}

.topbar {
  min-height: 104rpx;
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding-left: 20rpx;
  padding-right: 20rpx;
  background: #FFFFFF;
  border-bottom: 2rpx solid $color-border;
}

.icon-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-bg;
  color: $color-text;
  font-size: 34rpx;
  font-weight: 900;
}

.icon-btn.disabled {
  opacity: 0.35;
}

.title {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.title text:first-child {
  font-size: 32rpx;
  font-weight: 900;
  color: $color-text;
}

.title text:last-child {
  font-size: 22rpx;
  color: $color-text-secondary;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.export-btn,
.save-btn {
  height: 64rpx;
  padding: 0 24rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-primary;
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: 900;
}

.tool-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
  padding: 12rpx 18rpx 16rpx;
  background: #FFFFFF;
}

.mode-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10rpx;
  padding: 12rpx 18rpx 0;
  background: #FFFFFF;
}

.mode-btn {
  height: 58rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: $color-bg;
  color: $color-text-secondary;
  font-size: 25rpx;
  font-weight: 900;
}

.mode-btn.active {
  background: $color-primary-light;
  color: $color-primary;
}

.tool-btn {
  height: 92rpx;
  border-radius: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  background: $color-bg;
  color: $color-text-secondary;
}

.tool-btn.active {
  background: $color-primary-light;
  color: $color-primary;
  outline: 3rpx solid $color-primary;
}

.tool-btn text:first-child {
  font-size: 34rpx;
  font-weight: 900;
}

.tool-btn text:last-child {
  font-size: 22rpx;
  font-weight: 800;
}

.canvas-area {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 26rpx;
}

.pixel-board {
  width: min(86vw, 74vh);
  aspect-ratio: var(--board-cols) / var(--board-rows);
  display: grid;
  grid-template-columns: 28rpx repeat(var(--cols), 1fr);
  grid-template-rows: 28rpx repeat(var(--rows), 1fr);
  gap: 2rpx;
  padding: 12rpx;
  border-radius: 22rpx;
  background: #FFFFFF;
  box-shadow: $shadow-float;
  touch-action: none;
}

.axis {
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-weak;
  font-size: 14rpx;
  font-weight: 800;
}

.pixel-cell {
  min-width: 0;
  min-height: 0;
  border-radius: 20%;
  box-shadow: inset 0 -2rpx 0 rgba(74, 55, 40, 0.12);
}

.pixel-cell.empty {
  outline: 1rpx solid rgba(74, 55, 40, 0.08);
  box-shadow: none;
}

.pixel-cell.muted {
  opacity: 0.16;
  filter: grayscale(0.6);
}

.bottom-panel {
  padding: 16rpx 0 calc(18rpx + env(safe-area-inset-bottom));
  background: #FFFFFF;
  border-top: 2rpx solid $color-border;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding: 0 18rpx 14rpx;
}

.status-row > view:not(.current-color):not(.save-btn) {
  width: 92rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $color-bg;
}

.status-row text:first-child {
  font-size: 26rpx;
  font-weight: 900;
  color: $color-text;
}

.status-row text:last-child {
  font-size: 18rpx;
  color: $color-text-secondary;
}

.current-color {
  width: 58rpx;
  height: 58rpx;
  border-radius: 50%;
  border: 5rpx solid #FFFFFF;
  box-shadow: 0 0 0 3rpx $color-border;
}

.save-btn {
  margin-left: auto;
}

.palette-scroll {
  white-space: nowrap;
}

.palette-list {
  display: inline-flex;
  gap: 12rpx;
  padding: 0 18rpx;
}

.palette-color {
  width: 62rpx;
  height: 62rpx;
  padding: 5rpx;
  border-radius: 50%;
  border: 3rpx solid transparent;
}

.palette-color.active {
  border-color: $color-primary;
}

.palette-color view {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  box-shadow: inset 0 -4rpx 0 rgba(74, 55, 40, 0.12);
}

.material-scroll {
  margin-top: 14rpx;
  white-space: nowrap;
}

.material-list {
  display: inline-flex;
  gap: 10rpx;
  padding: 0 18rpx;
}

.material-chip {
  height: 52rpx;
  padding: 0 14rpx 0 8rpx;
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  border-radius: 999rpx;
  background: $color-bg;
  border: 3rpx solid transparent;
  color: $color-text;
  font-size: 22rpx;
  font-weight: 900;
}

.material-chip.active {
  border-color: $color-primary;
}

.material-chip view {
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
}
</style>
