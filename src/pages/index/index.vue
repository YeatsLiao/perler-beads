<template>
  <view class="page">
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="header-content">
        <view class="logo-area">
          <view class="logo">🧩</view>
          <view class="title">想想手作</view>
        </view>
        <view class="search-btn" @click="goSearch">
          <text class="search-icon">🔍</text>
        </view>
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <view class="banner">
        <swiper class="banner-swiper" indicator-dots autoplay>
          <swiper-item>
            <view class="banner-item">
              <view class="banner-bg"></view>
              <view class="banner-content">
                <text class="banner-emoji">✨</text>
                <text class="banner-text">把照片变成拼豆艺术</text>
              </view>
            </view>
          </swiper-item>
          <swiper-item>
            <view class="banner-item">
              <view class="banner-bg banner-bg-2"></view>
              <view class="banner-content">
                <text class="banner-emoji">🎨</text>
                <text class="banner-text">自由创作专属图案</text>
              </view>
            </view>
          </swiper-item>
          <swiper-item>
            <view class="banner-item">
              <view class="banner-bg banner-bg-3"></view>
              <view class="banner-content">
                <text class="banner-emoji">💝</text>
                <text class="banner-text">与同好分享创意</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <view class="section">
        <view class="section-title">创作方式</view>
        <view class="create-cards">
          <view class="create-card" @click="goGenerate">
            <view class="create-icon">📷</view>
            <view class="create-title">图片生成</view>
            <view class="create-desc">上传照片一键生成拼豆图纸</view>
          </view>
          <view class="create-card" @click="goEditor">
            <view class="create-icon">✏️</view>
            <view class="create-title">手绘创作</view>
            <view class="create-desc">从零开始绘制原创图案</view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <view class="section-title">热门作品</view>
          <view class="section-more" @click="goMore">更多 →</view>
        </view>
        <view class="work-list">
          <view 
            v-for="work in mockWorks" 
            :key="work._id" 
            class="work-card"
            @click="goDetail(work._id)"
          >
            <image class="work-image" :src="work.thumbnail" mode="aspectFill" />
            <view class="work-info">
              <view class="work-title">{{ work.title }}</view>
              <view class="work-author">{{ work.userInfo.nickname }}</view>
              <view class="work-stats">
                <text class="stat-item">❤️ {{ work.stats.likes }}</text>
                <text class="stat-item">👁️ {{ work.stats.views }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">分类浏览</view>
        <view class="category-grid">
          <view 
            v-for="cat in categories" 
            :key="cat.id" 
            class="category-item"
            @click="goCategory(cat.id)"
          >
            <view class="category-icon">{{ cat.icon }}</view>
            <view class="category-name">{{ cat.name }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const statusBarHeight = ref(0);

uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight || 0;
  }
});

const categories = [
  { id: 'cartoon', name: '卡通', icon: '🐱' },
  { id: 'character', name: '人物', icon: '👤' },
  { id: 'landscape', name: '风景', icon: '🌄' },
  { id: 'text', name: '文字', icon: '📝' },
  { id: 'other', name: '其他', icon: '✨' }
];

const mockWorks = [
  {
    _id: '1',
    title: '可爱猫咪',
    thumbnail: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20pixel%20art%20cat%20portrait&image_size=square',
    userInfo: { nickname: '手作达人', avatar: '' },
    stats: { likes: 128, views: 520 }
  },
  {
    _id: '2',
    title: '风景插画',
    thumbnail: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pixel%20art%20landscape%20sunset&image_size=square',
    userInfo: { nickname: '创意玩家', avatar: '' },
    stats: { likes: 89, views: 340 }
  },
  {
    _id: '3',
    title: '动漫角色',
    thumbnail: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=anime%20character%20pixel%20art&image_size=square',
    userInfo: { nickname: '像素大师', avatar: '' },
    stats: { likes: 256, views: 890 }
  }
];

function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' });
}

function goGenerate() {
  uni.navigateTo({ url: '/pages/generate/index' });
}

function goEditor() {
  uni.navigateTo({ url: '/pages/editor/index' });
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
  background: $color-bg;
}

.header {
  background: $gradient-primary;
  padding-bottom: 32rpx;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.logo {
  font-size: 56rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.search-btn {
  width: 64rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  font-size: 32rpx;
}

.content {
  height: calc(100vh - 180rpx);
  padding-bottom: 120rpx;
}

.banner {
  margin: 24rpx;
  border-radius: $radius-card;
  overflow: hidden;
}

.banner-swiper {
  height: 240rpx;
}

.banner-item {
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: $radius-card;
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $gradient-warm;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px);
    background-size: 20rpx 20rpx;
  }
}

.banner-bg-2 {
  background: $gradient-fresh;
}

.banner-bg-3 {
  background: linear-gradient(135deg, $color-lavender 0%, $color-peach-pink 100%);
}

.banner-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.banner-emoji {
  font-size: 56rpx;
  animation: bounce 2s infinite;
}

.banner-text {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-text;
  text-shadow: 0 2rpx 4rpx rgba(255,255,255,0.5);
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10rpx);
  }
}

.section {
  padding: 0 24rpx 24rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-text;
}

.section-more {
  font-size: 26rpx;
  color: $color-primary;
}

.create-cards {
  display: flex;
  gap: 20rpx;
}

.create-card {
  flex: 1;
  background: $color-card;
  border-radius: $radius-card;
  padding: 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: $shadow-card;
  
  &:active {
    transform: scale(0.98);
  }
}

.create-icon {
  font-size: 64rpx;
}

.create-title {
  font-size: 30rpx;
  font-weight: 500;
  color: $color-text;
}

.create-desc {
  font-size: 24rpx;
  color: $color-text-secondary;
  text-align: center;
}

.work-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.work-card {
  background: $color-card;
  border-radius: $radius-card;
  overflow: hidden;
  display: flex;
  box-shadow: $shadow-card;
  
  &:active {
    transform: scale(0.98);
  }
}

.work-image {
  width: 180rpx;
  height: 180rpx;
}

.work-info {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.work-title {
  font-size: 28rpx;
  font-weight: 500;
  color: $color-text;
}

.work-author {
  font-size: 24rpx;
  color: $color-text-secondary;
}

.work-stats {
  display: flex;
  gap: 20rpx;
  margin-top: auto;
}

.stat-item {
  font-size: 22rpx;
  color: $color-text-weak;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.category-item {
  width: calc(20% - 12.8rpx);
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
  }
}

.category-icon {
  font-size: 40rpx;
}

.category-name {
  font-size: 22rpx;
  color: $color-text-secondary;
}
</style>
