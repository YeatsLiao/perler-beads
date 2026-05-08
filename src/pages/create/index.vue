<template>
  <view class="page">
    <NavBar title="创作中心" />
    
    <scroll-view class="content" scroll-y>
      <view class="hero-section">
        <view class="hero-title">开启你的创作之旅</view>
        <view class="hero-subtitle">选择一种方式开始创作</view>
      </view>

      <view class="option-cards">
        <view class="option-card generate" @click="goGenerate">
          <view class="option-icon">📷</view>
          <view class="option-content">
            <view class="option-title">图片生成图纸</view>
            <view class="option-desc">上传任意图片，智能生成拼豆图纸，让创意轻松落地</view>
          </view>
          <view class="option-arrow">→</view>
        </view>

        <view class="option-card draw" @click="goEditor">
          <view class="option-icon">✏️</view>
          <view class="option-content">
            <view class="option-title">从零手绘创作</view>
            <view class="option-desc">在空白画布上自由创作，打造独一无二的原创图案</view>
          </view>
          <view class="option-arrow">→</view>
        </view>
      </view>

      <view class="tips-section">
        <view class="tips-title">💡 创作小贴士</view>
        <view class="tips-list">
          <view class="tip-item">
            <text class="tip-icon">🌟</text>
            <text class="tip-text">选择高对比度的图片可以获得更好的像素化效果</text>
          </view>
          <view class="tip-item">
            <text class="tip-icon">🎨</text>
            <text class="tip-text">建议使用32色以内的配色方案，更容易制作</text>
          </view>
          <view class="tip-item">
            <text class="tip-icon">📐</text>
            <text class="tip-text">标准拼豆板尺寸为29×29，建议保持在此范围内</text>
          </view>
        </view>
      </view>

      <view class="preset-section">
        <view class="section-title">热门尺寸预设</view>
        <view class="preset-grid">
          <view 
            v-for="preset in presets" 
            :key="preset.name"
            class="preset-item"
            @click="goEditorWithSize(preset.width, preset.height)"
          >
            <view class="preset-size">{{ preset.width }}×{{ preset.height }}</view>
            <view class="preset-name">{{ preset.name }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';

const presets = [
  { name: '正方形', width: 29, height: 29 },
  { name: '长方形', width: 29, height: 19 },
  { name: '长条', width: 29, height: 10 },
  { name: '大正方形', width: 32, height: 32 }
];

function goGenerate() {
  uni.navigateTo({ url: '/pages/generate/index' });
}

function goEditor() {
  uni.navigateTo({ url: '/pages/editor/index' });
}

function goEditorWithSize(width: number, height: number) {
  uni.navigateTo({ url: `/pages/editor/index?width=${width}&height=${height}` });
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
  padding-bottom: 48rpx;
}

.hero-section {
  text-align: center;
  padding: 48rpx 0;
}

.hero-title {
  font-size: 40rpx;
  font-weight: 700;
  color: $color-text;
  margin-bottom: 12rpx;
}

.hero-subtitle {
  font-size: 28rpx;
  color: $color-text-secondary;
}

.option-cards {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 32rpx;
}

.option-card {
  background: $color-card;
  border-radius: $radius-card;
  padding: 32rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: $shadow-card;
  
  &:active {
    transform: scale(0.98);
  }
  
  &.generate {
    border-left: 8rpx solid $color-primary;
  }
  
  &.draw {
    border-left: 8rpx solid #52C41A;
  }
}

.option-icon {
  font-size: 72rpx;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.option-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-text;
}

.option-desc {
  font-size: 26rpx;
  color: $color-text-secondary;
  line-height: 1.5;
}

.option-arrow {
  font-size: 36rpx;
  color: $color-text-weak;
}

.tips-section {
  background: linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%);
  border-radius: $radius-card;
  padding: 24rpx;
  margin-bottom: 32rpx;
}

.tips-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $color-text;
  margin-bottom: 16rpx;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.tip-icon {
  font-size: 28rpx;
}

.tip-text {
  font-size: 26rpx;
  color: $color-text-secondary;
  line-height: 1.5;
}

.preset-section {
  margin-bottom: 32rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $color-text;
  margin-bottom: 16rpx;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.preset-item {
  background: $color-card;
  border-radius: $radius-card;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  box-shadow: $shadow-card;
  
  &:active {
    transform: scale(0.98);
    background: $color-primary-light;
  }
}

.preset-size {
  font-size: 28rpx;
  font-weight: 600;
  color: $color-primary;
}

.preset-name {
  font-size: 24rpx;
  color: $color-text-secondary;
}
</style>
