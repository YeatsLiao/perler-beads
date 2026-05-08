<template>
  <view class="page">
    <NavBar title="导出" />
    
    <scroll-view class="content" scroll-y>
      <view class="preview-section">
        <view class="section-title">导出预览</view>
        <view class="preview-container">
          <canvas canvas-id="exportCanvas" class="preview-canvas"></canvas>
        </view>
      </view>

      <view class="options-section">
        <view class="section-title">导出格式</view>
        <view class="format-options">
          <view 
            v-for="format in formats" 
            :key="format.id"
            class="format-item"
            :class="{ active: selectedFormat === format.id }"
            @click="selectedFormat = format.id"
          >
            <text class="format-icon">{{ format.icon }}</text>
            <text class="format-name">{{ format.name }}</text>
          </view>
        </view>
      </view>

      <view class="options-section">
        <view class="section-title">导出选项</view>
        
        <view class="option-switch">
          <view class="switch-label">
            <text class="switch-name">显示网格线</text>
            <text class="switch-desc">打印时更方便对照</text>
          </view>
          <switch :checked="showGrid" @change="showGrid = $event.detail.value" color="#FF6B6B" />
        </view>

        <view class="option-switch">
          <view class="switch-label">
            <text class="switch-name">显示色号标注</text>
            <text class="switch-desc">每个像素显示对应色号</text>
          </view>
          <switch :checked="showColorId" @change="showColorId = $event.detail.value" color="#FF6B6B" />
        </view>

        <view class="option-switch">
          <view class="switch-label">
            <text class="switch-name">镜像翻转</text>
            <text class="switch-desc">熨烫后图案方向正确</text>
          </view>
          <switch :checked="flipHorizontal" @change="flipHorizontal = $event.detail.value" color="#FF6B6B" />
        </view>

        <view class="option-item">
          <view class="option-label">导出倍率</view>
          <view class="scale-options">
            <view 
              v-for="scale in scales" 
              :key="scale"
              class="scale-item"
              :class="{ active: exportScale === scale }"
              @click="exportScale = scale"
            >
              <text>{{ scale }}x</text>
            </view>
          </view>
        </view>

        <view class="option-item">
          <view class="option-label">背景设置</view>
          <view class="bg-options">
            <view 
              v-for="bg in backgrounds" 
              :key="bg.id"
              class="bg-item"
              :class="{ active: selectedBackground === bg.id }"
              @click="selectedBackground = bg.id"
            >
              <view class="bg-preview" :style="{ background: bg.color }"></view>
              <text class="bg-name">{{ bg.name }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="material-section">
        <view class="section-title">备料清单</view>
        <view class="material-list">
          <view 
            v-for="item in materialList" 
            :key="item.colorId"
            class="material-item"
          >
            <view class="color-dot" :style="{ background: item.hex }"></view>
            <view class="material-info">
              <text class="material-id">{{ item.colorId }}</text>
              <text class="material-name">{{ item.colorName }}</text>
            </view>
            <text class="material-count">{{ item.quantity }}颗</text>
          </view>
        </view>
      </view>

      <view class="action-section">
        <Button type="primary" @click="handleExport">导出图纸</Button>
        <Button type="secondary" style="margin-top: 16rpx;" @click="saveDraft">保存草稿</Button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import Button from '@/components/Button.vue';

const selectedFormat = ref('png');
const showGrid = ref(false);
const showColorId = ref(false);
const flipHorizontal = ref(false);
const exportScale = ref(3);
const selectedBackground = ref('white');

const formats = [
  { id: 'png', name: 'PNG', icon: '🖼️' },
  { id: 'jpg', name: 'JPG', icon: '📷' },
  { id: 'pdf', name: 'PDF', icon: '📄' }
];

const scales = [1, 2, 3, 5];

const backgrounds = [
  { id: 'white', name: '白色', color: '#FFFFFF' },
  { id: 'transparent', name: '透明', color: 'transparent' }
];

const materialList = [
  { colorId: '00000', colorName: '纯白', hex: '#FFFFFF', quantity: 128 },
  { colorId: '00014', colorName: '浅粉', hex: '#FFB7C5', quantity: 64 },
  { colorId: '00031', colorName: '蓝色', hex: '#0000FF', quantity: 32 },
  { colorId: '00026', colorName: '绿色', hex: '#00FF00', quantity: 48 },
  { colorId: '00041', colorName: '黑色', hex: '#000000', quantity: 16 }
];

onMounted(() => {
  drawPreview();
});

function drawPreview() {
  const ctx = uni.createCanvasContext('exportCanvas');
  const size = 280;
  const gridSize = 14;
  const pixelSize = size / gridSize;
  
  ctx.setFillStyle('#FFFFFF');
  ctx.fillRect(0, 0, size, size);
  
  const colors = ['#FFB7C5', '#0000FF', '#00FF00', '#FFFFFF', '#000000'];
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      ctx.setFillStyle(colors[colorIndex]);
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize - 1, pixelSize - 1);
    }
  }
  
  ctx.draw();
}

function handleExport() {
  uni.showLoading({ title: '导出中...' });
  
  setTimeout(() => {
    uni.hideLoading();
    uni.showToast({ title: '导出成功', icon: 'success' });
  }, 1500);
}

function saveDraft() {
  uni.showToast({ title: '草稿已保存', icon: 'success' });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $color-bg;
}

.content {
  height: calc(100vh - 112rpx);
  padding: 24rpx;
  padding-bottom: 120rpx;
}

.preview-section {
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text;
  margin-bottom: 16rpx;
}

.preview-container {
  background: $color-card;
  border-radius: $radius-card;
  padding: 24rpx;
  display: flex;
  justify-content: center;
  box-shadow: $shadow-card;
}

.preview-canvas {
  width: 320rpx;
  height: 320rpx;
  border-radius: $radius-image;
}

.options-section {
  background: $color-card;
  border-radius: $radius-card;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: $shadow-card;
}

.format-options {
  display: flex;
  gap: 20rpx;
}

.format-item {
  flex: 1;
  padding: 24rpx 16rpx;
  background: $color-bg;
  border-radius: $radius-button;
  border: 2rpx solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  
  &.active {
    border-color: $color-primary;
    background: $color-primary-light;
  }
}

.format-icon {
  font-size: 48rpx;
}

.format-name {
  font-size: 26rpx;
  color: $color-text;
}

.option-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 2rpx solid $color-border;
  
  &:last-child {
    border-bottom: none;
  }
}

.switch-label {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.switch-name {
  font-size: 28rpx;
  color: $color-text;
}

.switch-desc {
  font-size: 24rpx;
  color: $color-text-weak;
}

.option-item {
  padding: 20rpx 0;
}

.option-label {
  font-size: 28rpx;
  color: $color-text;
  margin-bottom: 16rpx;
}

.scale-options {
  display: flex;
  gap: 16rpx;
}

.scale-item {
  flex: 1;
  padding: 20rpx;
  background: $color-bg;
  border-radius: $radius-button;
  text-align: center;
  font-size: 28rpx;
  color: $color-text;
  border: 2rpx solid transparent;
  
  &.active {
    border-color: $color-primary;
    color: $color-primary;
    font-weight: 600;
  }
}

.bg-options {
  display: flex;
  gap: 20rpx;
}

.bg-item {
  flex: 1;
  padding: 20rpx 16rpx;
  background: $color-bg;
  border-radius: $radius-button;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  border: 2rpx solid transparent;
  
  &.active {
    border-color: $color-primary;
  }
}

.bg-preview {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  border: 2rpx solid $color-border;
}

.bg-name {
  font-size: 26rpx;
  color: $color-text;
}

.material-section {
  background: $color-card;
  border-radius: $radius-card;
  padding: 24rpx;
  margin-bottom: 32rpx;
  box-shadow: $shadow-card;
}

.material-list {
  max-height: 400rpx;
  overflow-y: auto;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 0;
  border-bottom: 2rpx solid $color-border;
  
  &:last-child {
    border-bottom: none;
  }
}

.color-dot {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  border: 2rpx solid $color-border;
}

.material-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.material-id {
  font-size: 26rpx;
  font-weight: 600;
  color: $color-text;
}

.material-name {
  font-size: 24rpx;
  color: $color-text-secondary;
}

.material-count {
  font-size: 26rpx;
  color: $color-primary;
  font-weight: 600;
}

.action-section {
  padding-bottom: 48rpx;
}
</style>
