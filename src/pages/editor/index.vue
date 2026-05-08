<template>
  <view class="editor-page">
    <view class="editor-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-left" @click="handleBack">
        <text>←</text>
      </view>
      <view class="header-center">
        <text class="header-title">编辑器</text>
      </view>
      <view class="header-right">
        <text class="header-btn" @click="handleSave">保存</text>
        <text class="header-btn" @click="handleExport">导出</text>
      </view>
    </view>

    <view class="toolbar">
      <view 
        v-for="tool in tools" 
        :key="tool.type"
        class="tool-item"
        :class="{ active: currentTool === tool.type }"
        @click="setTool(tool.type)"
      >
        <text class="tool-icon">{{ tool.icon }}</text>
        <text class="tool-name">{{ tool.name }}</text>
      </view>
    </view>

    <view class="canvas-container">
      <canvas 
        canvas-id="editorCanvas" 
        class="editor-canvas"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      ></canvas>
    </view>

    <view class="color-picker">
      <scroll-view scroll-x class="color-scroll">
        <view class="color-list">
          <view 
            v-for="color in paletteColors" 
            :key="color.id"
            class="color-item"
            :class="{ active: currentColor === color.hex }"
            :style="{ background: color.hex }"
            @click="setColor(color.hex)"
          ></view>
        </view>
      </scroll-view>
    </view>

    <view class="stats-panel">
      <view class="stats-row">
        <view class="stat-item">
          <text class="stat-value">{{ pixelCount }}</text>
          <text class="stat-label">像素数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ colorCount }}</text>
          <text class="stat-label">颜色数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ canvasWidth }}×{{ canvasHeight }}</text>
          <text class="stat-label">尺寸</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEditorStore } from '@/stores/editor';
import { DEFAULT_PALETTE } from '@/constants/palettes';
import type { ToolType } from '@/types';

const store = useEditorStore();

const statusBarHeight = ref(0);
const currentTool = ref<ToolType>('pen');
const currentColor = ref('#000000');
const canvasWidth = ref(29);
const canvasHeight = ref(29);

const tools = [
  { type: 'pen' as ToolType, name: '画笔', icon: '✏️' },
  { type: 'fill' as ToolType, name: '填充', icon: '🪣' },
  { type: 'eyedropper' as ToolType, name: '吸管', icon: '💉' },
  { type: 'eraser' as ToolType, name: '橡皮', icon: '🧹' }
];

const paletteColors = DEFAULT_PALETTE.colors;

const pixelCount = computed(() => canvasWidth.value * canvasHeight.value);
const colorCount = ref(1);

onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      statusBarHeight.value = res.statusBarHeight || 0;
    }
  });
  
  initCanvas();
});

function initCanvas() {
  const ctx = uni.createCanvasContext('editorCanvas');
  const size = 400;
  const pixelSize = size / canvasWidth.value;
  
  ctx.setFillStyle('#FFFFFF');
  ctx.fillRect(0, 0, size, size);
  
  ctx.setStrokeStyle('#E8E8E8');
  ctx.setLineWidth(0.5);
  
  for (let i = 0; i <= canvasWidth.value; i++) {
    ctx.beginPath();
    ctx.moveTo(i * pixelSize, 0);
    ctx.lineTo(i * pixelSize, size);
    ctx.stroke();
  }
  
  for (let i = 0; i <= canvasHeight.value; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * pixelSize);
    ctx.lineTo(size, i * pixelSize);
    ctx.stroke();
  }
  
  ctx.draw();
}

function setTool(tool: ToolType) {
  currentTool.value = tool;
  store.setTool(tool);
}

function setColor(color: string) {
  currentColor.value = color;
  store.setColor(color);
}

function handleTouchStart(e: TouchEvent) {
  const touch = e.touches[0];
  drawPixel(touch.clientX, touch.clientY);
}

function handleTouchMove(e: TouchEvent) {
  const touch = e.touches[0];
  drawPixel(touch.clientX, touch.clientY);
}

function handleTouchEnd() {
}

function drawPixel(x: number, y: number) {
  const ctx = uni.createCanvasContext('editorCanvas');
  const size = 400;
  const pixelSize = size / canvasWidth.value;
  
  const canvasX = Math.floor(x / pixelSize);
  const canvasY = Math.floor((y - statusBarHeight.value - 120) / pixelSize);
  
  if (canvasX >= 0 && canvasX < canvasWidth.value && canvasY >= 0 && canvasY < canvasHeight.value) {
    ctx.setFillStyle(currentColor.value);
    ctx.fillRect(canvasX * pixelSize, canvasY * pixelSize, pixelSize - 1, pixelSize - 1);
    ctx.draw(true);
  }
}

function handleBack() {
  uni.navigateBack({
    fail: () => {
      uni.switchTab({ url: '/pages/index/index' });
    }
  });
}

function handleSave() {
  uni.showToast({
    title: '草稿已保存',
    icon: 'success'
  });
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
  background: $color-bg;
}

.editor-header {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  height: 88rpx;
}

.header-left {
  width: 80rpx;
  font-size: 40rpx;
  color: #FFFFFF;
}

.header-center {
  flex: 1;
  text-align: center;
}

.header-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.header-right {
  display: flex;
  gap: 24rpx;
}

.header-btn {
  font-size: 28rpx;
  color: #FFFFFF;
}

.toolbar {
  background: #FFFFFF;
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  border-bottom: 2rpx solid $color-border;
}

.tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 32rpx;
  border-radius: $radius-button;
  transition: all 0.2s ease;
  
  &.active {
    background: $color-primary-light;
  }
}

.tool-icon {
  font-size: 40rpx;
}

.tool-name {
  font-size: 24rpx;
  color: $color-text-secondary;
}

.canvas-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx;
}

.editor-canvas {
  width: 600rpx;
  height: 600rpx;
  background: #FFFFFF;
  border-radius: $radius-card;
  box-shadow: $shadow-card;
}

.color-picker {
  background: #FFFFFF;
  padding: 20rpx 0;
  border-top: 2rpx solid $color-border;
}

.color-scroll {
  white-space: nowrap;
}

.color-list {
  display: inline-flex;
  gap: 16rpx;
  padding: 0 24rpx;
}

.color-item {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 4rpx solid transparent;
  
  &.active {
    border-color: $color-primary;
    transform: scale(1.1);
  }
}

.stats-panel {
  background: $color-card;
  padding: 20rpx 24rpx;
  border-top: 2rpx solid $color-border;
}

.stats-row {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-primary;
}

.stat-label {
  font-size: 22rpx;
  color: $color-text-weak;
}
</style>
