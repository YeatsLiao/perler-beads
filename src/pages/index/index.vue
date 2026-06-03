<template>
  <view class="page">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="brand">
          <view class="brand-mark">
            <view v-for="i in 9" :key="i" class="mark-dot"></view>
          </view>
          <view>
            <view class="brand-title">想想手作</view>
            <view class="brand-subtitle">拼豆图纸创作台</view>
          </view>
        </view>
        <view class="search-btn" @click="goSearch">
          <text>⌕</text>
        </view>
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="hero surface">
        <view class="hero-copy">
          <text class="hero-title">把灵感变成一颗颗可制作的拼豆</text>
          <text class="hero-text">上传照片、微调色板、生成备料清单，再进入编辑器慢慢打磨。</text>
          <view class="hero-actions">
            <view class="primary-action" @click="goGenerate">图片生成</view>
            <view class="secondary-action" @click="goEditor">手绘图纸</view>
          </view>
        </view>
        <view class="hero-art">
          <PixelPreview :pattern="featured.pattern" raised background="#FFFDF9" />
          <view class="floating-chip top">{{ featured.sketch.width }}×{{ featured.sketch.height }}</view>
          <view class="floating-chip bottom">{{ featured.sketch.colorCount }} 色</view>
        </view>
      </view>

      <view class="quick-grid">
        <view
          v-for="item in quickActions"
          :key="item.title"
          class="quick-card surface"
          @click="item.action"
        >
          <view class="quick-icon" :style="{ background: item.tint }">{{ item.icon }}</view>
          <text class="quick-title">{{ item.title }}</text>
          <text class="quick-desc">{{ item.desc }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <view>
            <view class="section-title">精选图纸</view>
            <view class="section-desc">适合直接复用或改色的小尺寸作品</view>
          </view>
          <view class="section-more" @click="goMore">更多</view>
        </view>
        <scroll-view class="featured-scroll" scroll-x>
          <view class="featured-list">
            <view
              v-for="work in demoWorks"
              :key="work._id"
              class="work-card surface"
              @click="goDetail(work._id)"
            >
              <PixelPreview :pattern="work.pattern" compact background="#FFF8F0" />
              <view class="work-body">
                <view class="work-title">{{ work.title }}</view>
                <view class="work-meta">
                  <text>{{ work.mood }}</text>
                  <text>{{ work.sketch.width }}×{{ work.sketch.height }}</text>
                </view>
                <view class="palette-strip">
                  <view
                    v-for="color in work.palette.slice(0, 5)"
                    :key="color"
                    class="palette-dot"
                    :style="{ background: color }"
                  ></view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="section">
        <view class="section-header">
          <view>
            <view class="section-title">分类灵感</view>
            <view class="section-desc">按制作场景快速开始</view>
          </view>
        </view>
        <view class="category-grid">
          <view
            v-for="cat in categories"
            :key="cat.id"
            class="category-item"
            :style="{ background: cat.bg }"
            @click="goCategory(cat.id)"
          >
            <text class="category-icon">{{ cat.icon }}</text>
            <text class="category-name">{{ cat.name }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PixelPreview from '@/components/PixelPreview.vue';
import { demoWorks } from '@/utils/demoWorks';
import { useEditorStore } from '@/stores/editor';

const store = useEditorStore();
const statusBarHeight = ref(0);
const featured = demoWorks[0];

uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 0;
  }
});

const quickActions = [
  { title: '照片转图纸', desc: '自动匹配色号', icon: '▣', tint: '#FFF0EB', action: goGenerate },
  { title: '空白画布', desc: '29×29 起步', icon: '✦', tint: '#EAF8F3', action: goEditor },
  { title: '备料清单', desc: '统计每色颗数', icon: '≡', tint: '#FFF7DC', action: goExport }
];

const categories = [
  { id: 'cartoon', name: '挂件', icon: '★', bg: '#FFF0EB' },
  { id: 'landscape', name: '杯垫', icon: '◐', bg: '#EAF8F3' },
  { id: 'text', name: '字牌', icon: 'A', bg: '#EEF6FF' },
  { id: 'other', name: '礼物', icon: '✿', bg: '#F7F0FF' }
];

function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' });
}

function goGenerate() {
  uni.navigateTo({ url: '/pages/generate/index' });
}

function goEditor() {
  store.setCanvasSize(29, 29);
  uni.navigateTo({ url: '/pages/editor/index' });
}

function goExport() {
  uni.navigateTo({ url: '/pages/export/index' });
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/work-detail/index?id=${id}` });
}

function goMore() {
  uni.navigateTo({ url: '/pages/search/index?tab=hot' });
}

function goCategory(id: string) {
  uni.navigateTo({ url: `/pages/search/index?category=${id}` });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 12% 0%, rgba(255, 183, 197, 0.28), transparent 34%),
    radial-gradient(circle at 88% 8%, rgba(184, 224, 210, 0.34), transparent 28%),
    $color-bg;
}

.header {
  padding-bottom: 18rpx;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx 8rpx;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.brand-mark {
  width: 68rpx;
  height: 68rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5rpx;
  padding: 8rpx;
  background: #FFFFFF;
  border-radius: 18rpx;
  box-shadow: $shadow-card;
}

.mark-dot {
  border-radius: 6rpx;
  background: $color-primary;
}

.mark-dot:nth-child(2),
.mark-dot:nth-child(4),
.mark-dot:nth-child(6) {
  background: $color-mint;
}

.mark-dot:nth-child(5),
.mark-dot:nth-child(8) {
  background: $color-warning;
}

.brand-title {
  font-size: 38rpx;
  font-weight: 800;
  color: $color-text;
  line-height: 1.1;
}

.brand-subtitle {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $color-text-secondary;
}

.search-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: $shadow-card;
  color: $color-text;
  font-size: 38rpx;
}

.content {
  height: calc(100vh - 124rpx);
  padding: 0 24rpx 132rpx;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 22rpx;
  padding: 30rpx;
  border-radius: $radius-large;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18rpx;
}

.hero-title {
  font-size: 42rpx;
  font-weight: 800;
  line-height: 1.18;
  color: $color-text;
}

.hero-text {
  font-size: 25rpx;
  color: $color-text-secondary;
  line-height: 1.55;
}

.hero-actions {
  display: flex;
  gap: 14rpx;
  margin-top: 6rpx;
}

.primary-action,
.secondary-action {
  height: 64rpx;
  padding: 0 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  font-size: 25rpx;
  font-weight: 700;
}

.primary-action {
  color: #FFFFFF;
  background: $gradient-primary;
  box-shadow: $shadow-button;
}

.secondary-action {
  color: $color-text;
  background: #FFF8F0;
  border: 2rpx solid $color-border;
}

.hero-art {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 430rpx;
  align-self: center;
}

.floating-chip {
  position: absolute;
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #FFFFFF;
  color: $color-text;
  font-size: 21rpx;
  font-weight: 700;
  box-shadow: $shadow-card;
}

.floating-chip.top {
  top: -12rpx;
  right: 4rpx;
}

.floating-chip.bottom {
  left: 8rpx;
  bottom: -14rpx;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin: 24rpx 0 34rpx;
}

.quick-card {
  min-height: 172rpx;
  padding: 20rpx 16rpx;
  border-radius: 22rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8rpx;
}

.quick-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  font-size: 26rpx;
  color: $color-text;
  font-weight: 800;
}

.quick-title {
  font-size: 25rpx;
  font-weight: 800;
  color: $color-text;
}

.quick-desc {
  font-size: 21rpx;
  color: $color-text-secondary;
}

.section {
  margin-bottom: 34rpx;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 800;
  color: $color-text;
}

.section-desc {
  margin-top: 4rpx;
  font-size: 23rpx;
  color: $color-text-secondary;
}

.section-more {
  padding: 12rpx 20rpx;
  border-radius: 999rpx;
  background: #FFFFFF;
  color: $color-primary;
  font-size: 24rpx;
  font-weight: 700;
  box-shadow: $shadow-card;
}

.featured-scroll {
  white-space: nowrap;
}

.featured-list {
  display: inline-flex;
  gap: 18rpx;
  padding-bottom: 8rpx;
}

.work-card {
  width: 286rpx;
  display: inline-flex;
  flex-direction: column;
  padding: 16rpx;
  border-radius: 24rpx;
  white-space: normal;
}

.work-body {
  padding: 16rpx 4rpx 2rpx;
}

.work-title {
  font-size: 26rpx;
  font-weight: 800;
  color: $color-text;
}

.work-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8rpx;
  font-size: 21rpx;
  color: $color-text-secondary;
}

.palette-strip {
  display: flex;
  margin-top: 14rpx;
}

.palette-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  border: 2rpx solid #FFFFFF;
  margin-right: -5rpx;
  box-shadow: 0 2rpx 6rpx rgba(74, 55, 40, 0.12);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.category-item {
  min-height: 128rpx;
  border-radius: 22rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.75);
}

.category-icon {
  font-size: 34rpx;
  font-weight: 900;
  color: $color-text;
}

.category-name {
  font-size: 23rpx;
  color: $color-text-secondary;
  font-weight: 700;
}
</style>
