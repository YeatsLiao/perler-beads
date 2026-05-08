<template>
  <view class="page">
    <NavBar title="图片生成" />
    
    <scroll-view class="content" scroll-y>
      <view class="upload-section">
        <view 
          class="upload-area"
          @click="chooseImage"
          @touchmove.stop
        >
          <view v-if="!imageSrc" class="upload-placeholder">
            <text class="upload-icon">📷</text>
            <text class="upload-text">点击上传图片</text>
            <text class="upload-hint">支持 JPG、PNG 格式</text>
          </view>
          <image v-else class="preview-image" :src="imageSrc" mode="aspectFill" />
        </view>
        
        <view v-if="imageSrc" class="upload-actions">
          <view class="action-btn" @click="chooseImage">
            <text>重新选择</text>
          </view>
          <view class="action-btn" @click="clearImage">
            <text>清除图片</text>
          </view>
        </view>
      </view>

      <view class="options-section">
        <view class="section-title">参数设置</view>
        
        <view class="option-item">
          <view class="option-label">像素大小</view>
          <view class="option-control">
            <slider 
              v-model="pixelSize" 
              :min="2" 
              :max="30" 
              :step="1"
              activeColor="#FF6B6B"
              backgroundColor="#E8E8E8"
            />
            <text class="option-value">{{ pixelSize }}px</text>
          </view>
        </view>

        <view class="option-item">
          <view class="option-label">颜色数量</view>
          <view class="option-control">
            <slider 
              v-model="colorCount" 
              :min="4" 
              :max="64" 
              :step="4"
              activeColor="#FF6B6B"
              backgroundColor="#E8E8E8"
            />
            <text class="option-value">{{ colorCount }}色</text>
          </view>
        </view>

        <view class="option-item">
          <view class="option-label">亮度</view>
          <view class="option-control">
            <slider 
              v-model="brightness" 
              :min="-100" 
              :max="100" 
              :step="5"
              activeColor="#FF6B6B"
              backgroundColor="#E8E8E8"
            />
            <text class="option-value">{{ brightness > 0 ? '+' : '' }}{{ brightness }}</text>
          </view>
        </view>

        <view class="option-item">
          <view class="option-label">对比度</view>
          <view class="option-control">
            <slider 
              v-model="contrast" 
              :min="-100" 
              :max="100" 
              :step="5"
              activeColor="#FF6B6B"
              backgroundColor="#E8E8E8"
            />
            <text class="option-value">{{ contrast > 0 ? '+' : '' }}{{ contrast }}</text>
          </view>
        </view>

        <view class="option-item">
          <view class="option-label">饱和度</view>
          <view class="option-control">
            <slider 
              v-model="saturation" 
              :min="-100" 
              :max="100" 
              :step="5"
              activeColor="#FF6B6B"
              backgroundColor="#E8E8E8"
            />
            <text class="option-value">{{ saturation > 0 ? '+' : '' }}{{ saturation }}</text>
          </view>
        </view>

        <view class="option-item">
          <view class="option-label">色板选择</view>
          <view class="palette-selector">
            <view 
              v-for="palette in palettes" 
              :key="palette.id"
              class="palette-item"
              :class="{ active: selectedPalette === palette.id }"
              @click="selectedPalette = palette.id"
            >
              <text class="palette-name">{{ palette.brandCn }}</text>
              <text class="palette-count">{{ palette.colors.length }}色</text>
            </view>
          </view>
        </view>
      </view>

      <view class="preview-section">
        <view class="section-title">预览对比</view>
        <view class="compare-container">
          <view class="compare-panel">
            <text class="panel-label">原图</text>
            <image v-if="imageSrc" class="compare-image" :src="imageSrc" mode="aspectFit" />
          </view>
          <view class="compare-panel">
            <text class="panel-label">像素化效果</text>
            <canvas canvas-id="previewCanvas" class="compare-canvas"></canvas>
          </view>
        </view>
      </view>

      <view class="action-section">
        <Button type="primary" @click="generate">生成图纸</Button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import Button from '@/components/Button.vue';
import { PALETTES } from '@/constants/palettes';

const imageSrc = ref('');
const pixelSize = ref(10);
const colorCount = ref(32);
const brightness = ref(0);
const contrast = ref(0);
const saturation = ref(0);
const selectedPalette = ref(PALETTES[0].id);

const palettes = PALETTES;

onMounted(() => {
});

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      imageSrc.value = res.tempFilePaths[0];
      updatePreview();
    }
  });
}

function clearImage() {
  imageSrc.value = '';
}

function updatePreview() {
  if (!imageSrc.value) return;
  
  const ctx = uni.createCanvasContext('previewCanvas');
  
  uni.getImageInfo({
    src: imageSrc.value,
    success: (info) => {
      const size = 200;
      let width = info.width;
      let height = info.height;
      
      if (width > height) {
        height = (height / width) * size;
        width = size;
      } else {
        width = (width / height) * size;
        height = size;
      }
      
      ctx.drawImage(imageSrc.value, 0, 0, width, height);
      ctx.draw();
    }
  });
}

function generate() {
  if (!imageSrc.value) {
    uni.showToast({ title: '请先上传图片', icon: 'none' });
    return;
  }
  
  uni.showLoading({ title: '生成中...' });
  
  setTimeout(() => {
    uni.hideLoading();
    uni.navigateTo({ url: '/pages/editor/index' });
  }, 1500);
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

.upload-section {
  margin-bottom: 32rpx;
}

.upload-area {
  width: 100%;
  height: 400rpx;
  background: $color-card;
  border-radius: $radius-card;
  border: 4rpx dashed $color-border;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.upload-icon {
  font-size: 80rpx;
}

.upload-text {
  font-size: 30rpx;
  color: $color-text;
}

.upload-hint {
  font-size: 24rpx;
  color: $color-text-weak;
}

.preview-image {
  width: 100%;
  height: 100%;
}

.upload-actions {
  display: flex;
  justify-content: center;
  gap: 32rpx;
  margin-top: 20rpx;
}

.action-btn {
  padding: 16rpx 40rpx;
  background: $color-card;
  border-radius: $radius-button;
  font-size: 26rpx;
  color: $color-text-secondary;
  box-shadow: $shadow-card;
  
  &:active {
    transform: scale(0.98);
  }
}

.options-section {
  background: $color-card;
  border-radius: $radius-card;
  padding: 24rpx;
  margin-bottom: 32rpx;
  box-shadow: $shadow-card;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text;
  margin-bottom: 24rpx;
}

.option-item {
  margin-bottom: 28rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.option-label {
  font-size: 28rpx;
  color: $color-text;
  margin-bottom: 16rpx;
}

.option-control {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.option-value {
  width: 100rpx;
  font-size: 26rpx;
  color: $color-primary;
  text-align: right;
}

.palette-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.palette-item {
  padding: 16rpx 24rpx;
  background: $color-bg;
  border-radius: $radius-button;
  border: 2rpx solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
  
  &.active {
    border-color: $color-primary;
    background: $color-primary-light;
  }
}

.palette-name {
  font-size: 26rpx;
  color: $color-text;
}

.palette-count {
  font-size: 22rpx;
  color: $color-text-secondary;
}

.preview-section {
  background: $color-card;
  border-radius: $radius-card;
  padding: 24rpx;
  margin-bottom: 32rpx;
  box-shadow: $shadow-card;
}

.compare-container {
  display: flex;
  gap: 24rpx;
}

.compare-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.panel-label {
  font-size: 24rpx;
  color: $color-text-secondary;
}

.compare-image, .compare-canvas {
  width: 280rpx;
  height: 280rpx;
  border-radius: $radius-image;
  background: $color-bg;
}

.action-section {
  padding-bottom: 48rpx;
}
</style>
