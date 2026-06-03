<template>
  <view class="page">
    <NavBar title="创作中心" />

    <scroll-view class="content" scroll-y>
      <view class="studio-card surface">
        <view class="studio-copy">
          <text class="studio-title">今天想做哪一种图纸？</text>
          <text class="studio-desc">先确定来源和尺寸，再进入编辑器。小尺寸更适合新手，大尺寸适合照片转图纸。</text>
        </view>
        <view class="studio-board">
          <PixelPreview :pattern="demoWorks[2].pattern" compact background="#FFFDF9" />
        </view>
      </view>

      <view class="method-list">
        <view class="method-card surface generate" @click="goGenerate">
          <view class="method-icon">▧</view>
          <view class="method-main">
            <text class="method-title">图片生成图纸</text>
            <text class="method-desc">适合头像、宠物照、风景图，自动像素化并匹配品牌色板。</text>
            <view class="method-tags">
              <text>照片</text>
              <text>自动配色</text>
              <text>可编辑</text>
            </view>
          </view>
          <text class="method-arrow">›</text>
        </view>

        <view class="method-card surface draw" @click="goEditor">
          <view class="method-icon">✦</view>
          <view class="method-main">
            <text class="method-title">从空白画布开始</text>
            <text class="method-desc">适合字母牌、小挂件和原创像素图，直接选择尺寸开始落豆。</text>
            <view class="method-tags">
              <text>手绘</text>
              <text>网格画布</text>
              <text>轻量</text>
            </view>
          </view>
          <text class="method-arrow">›</text>
        </view>
      </view>

      <view class="section">
        <view class="section-title">尺寸预设</view>
        <view class="preset-grid">
          <view
            v-for="preset in presets"
            :key="preset.name"
            class="preset-item surface"
            @click="goEditorWithSize(preset.width, preset.height)"
          >
            <text class="preset-size">{{ preset.width }}×{{ preset.height }}</text>
            <text class="preset-name">{{ preset.name }}</text>
            <text class="preset-desc">{{ preset.desc }}</text>
          </view>
        </view>
      </view>

      <view class="tips surface">
        <view class="tips-title">制作前小检查</view>
        <view class="tip-row" v-for="tip in tips" :key="tip">
          <view class="tip-dot"></view>
          <text>{{ tip }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import PixelPreview from '@/components/PixelPreview.vue';
import { demoWorks } from '@/utils/demoWorks';

const presets = [
  { name: '标准方板', width: 29, height: 29, desc: '钥匙扣 / 小装饰' },
  { name: '横向杯垫', width: 29, height: 19, desc: '风景 / 字牌' },
  { name: '迷你长条', width: 29, height: 10, desc: '姓名牌 / 边框' },
  { name: '大正方形', width: 32, height: 32, desc: '照片图纸' }
];

const tips = [
  '照片建议选择主体清楚、背景简单的图',
  '新手尽量控制在 12 色以内，备料更轻松',
  '需要熨烫背面时，导出前记得开启镜像'
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
  background:
    radial-gradient(circle at 92% 3%, rgba(168, 216, 234, 0.32), transparent 28%),
    $color-bg;
}

.content {
  height: calc(100vh - 112rpx);
  padding: 136rpx 24rpx 132rpx;
}

.studio-card {
  display: grid;
  grid-template-columns: 1fr 170rpx;
  gap: 22rpx;
  padding: 28rpx;
  border-radius: $radius-large;
  margin-bottom: 24rpx;
}

.studio-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14rpx;
}

.studio-title {
  font-size: 40rpx;
  line-height: 1.18;
  font-weight: 800;
  color: $color-text;
}

.studio-desc {
  font-size: 25rpx;
  color: $color-text-secondary;
  line-height: 1.55;
}

.studio-board {
  display: flex;
  align-items: center;
}

.method-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  margin-bottom: 32rpx;
}

.method-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 26rpx;
  border-radius: 26rpx;
  overflow: hidden;
}

.method-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20rpx;
  bottom: 20rpx;
  width: 8rpx;
  border-radius: 999rpx;
}

.method-card.generate::before {
  background: $color-primary;
}

.method-card.draw::before {
  background: $color-success;
}

.method-icon {
  width: 78rpx;
  height: 78rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 22rpx;
  background: #FFF0EB;
  color: $color-primary;
  font-size: 38rpx;
  font-weight: 900;
}

.method-card.draw .method-icon {
  background: #EAF8F3;
  color: $color-success;
}

.method-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 9rpx;
}

.method-title {
  font-size: 31rpx;
  font-weight: 800;
  color: $color-text;
}

.method-desc {
  font-size: 24rpx;
  line-height: 1.5;
  color: $color-text-secondary;
}

.method-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.method-tags text {
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: $color-bg;
  color: $color-text-secondary;
  font-size: 20rpx;
}

.method-arrow {
  font-size: 54rpx;
  color: $color-text-weak;
}

.section {
  margin-bottom: 28rpx;
}

.section-title {
  margin-bottom: 16rpx;
  font-size: 31rpx;
  font-weight: 800;
  color: $color-text;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.preset-item {
  min-height: 160rpx;
  padding: 22rpx;
  border-radius: 22rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.preset-size {
  font-size: 32rpx;
  font-weight: 900;
  color: $color-primary;
}

.preset-name {
  font-size: 25rpx;
  font-weight: 800;
  color: $color-text;
}

.preset-desc {
  font-size: 21rpx;
  color: $color-text-secondary;
}

.tips {
  padding: 24rpx;
  border-radius: 24rpx;
}

.tips-title {
  margin-bottom: 16rpx;
  font-size: 28rpx;
  font-weight: 800;
  color: $color-text;
}

.tip-row {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 10rpx 0;
  font-size: 24rpx;
  color: $color-text-secondary;
  line-height: 1.45;
}

.tip-dot {
  width: 12rpx;
  height: 12rpx;
  margin-top: 11rpx;
  border-radius: 50%;
  background: $color-primary;
  flex-shrink: 0;
}
</style>
