<template>
  <view class="tabbar">
    <view 
      v-for="(item, index) in tabs" 
      :key="index"
      class="tabbar-item"
      :class="{ active: currentIndex === index }"
      @click="switchTab(item.path, index)"
    >
      <view class="tabbar-icon">
        <view v-if="item.key === 'home'" class="icon-home">
          <view class="home-top"></view>
          <view class="home-body"></view>
          <view class="home-door"></view>
        </view>
        <view v-else-if="item.key === 'create'" class="icon-create">
          <view class="create-square"></view>
          <view class="create-plus"></view>
        </view>
        <view v-else-if="item.key === 'works'" class="icon-works">
          <view class="works-grid">
            <view class="grid-item" v-for="i in 6" :key="i"></view>
          </view>
        </view>
        <view v-else-if="item.key === 'profile'" class="icon-profile">
          <view class="profile-head"></view>
          <view class="profile-body"></view>
        </view>
      </view>
      <text class="tabbar-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const tabs = [
  { key: 'home', text: '首页', path: '/pages/index/index' },
  { key: 'create', text: '创作', path: '/pages/create/index' },
  { key: 'works', text: '作品', path: '/pages/works/index' },
  { key: 'profile', text: '我的', path: '/pages/profile/index' }
];

const currentIndex = ref(0);

function getCurrentPageIndex() {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    const pagePath = '/' + currentPage.route;
    const index = tabs.findIndex(tab => tab.path === pagePath);
    return index >= 0 ? index : 0;
  }
  return 0;
}

function switchTab(path: string, index: number) {
  if (currentIndex.value === index) return;
  currentIndex.value = index;
  uni.switchTab({ url: path });
}

onMounted(() => {
  currentIndex.value = getCurrentPageIndex();
});
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 -4rpx 20rpx rgba(255, 140, 105, 0.08);
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 1000;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rpx 0;
  transition: all 0.2s ease;
  
  &.active {
    .tabbar-icon {
      transform: scale(1.1);
    }
    
    .tabbar-text {
      color: $color-primary;
    }
  }
}

.tabbar-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4rpx;
  transition: transform 0.2s ease;
}

.tabbar-text {
  font-size: 22rpx;
  color: $color-text-secondary;
  transition: color 0.2s ease;
}

.icon-home {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  
  .home-top {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 16rpx solid transparent;
    border-right: 16rpx solid transparent;
    border-bottom: 12rpx solid $color-text-secondary;
    .active & {
      border-bottom-color: $color-primary;
    }
  }
  
  .home-body {
    position: absolute;
    top: 12rpx;
    left: 4rpx;
    width: 24rpx;
    height: 18rpx;
    background: $color-text-secondary;
    .active & {
      background: $color-primary;
    }
  }
  
  .home-door {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 8rpx;
    height: 10rpx;
    background: $color-bg;
  }
}

.icon-create {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  
  .create-square {
    width: 32rpx;
    height: 32rpx;
    border: 4rpx solid $color-text-secondary;
    border-radius: 4rpx;
    .active & {
      border-color: $color-primary;
    }
  }
  
  .create-plus {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 16rpx;
    height: 4rpx;
    background: $color-text-secondary;
    .active & {
      background: $color-primary;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 4rpx;
      height: 16rpx;
      background: inherit;
    }
  }
}

.icon-works {
  .works-grid {
    display: flex;
    flex-wrap: wrap;
    width: 32rpx;
    height: 32rpx;
    gap: 4rpx;
    
    .grid-item {
      width: 8rpx;
      height: 8rpx;
      background: $color-text-secondary;
      border-radius: 2rpx;
      .active & {
        background: $color-primary;
      }
    }
  }
}

.icon-profile {
  position: relative;
  width: 32rpx;
  height: 32rpx;
  
  .profile-head {
    position: absolute;
    top: 2rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 18rpx;
    height: 18rpx;
    background: $color-text-secondary;
    border-radius: 50%;
    .active & {
      background: $color-primary;
    }
  }
  
  .profile-body {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 24rpx;
    height: 14rpx;
    background: $color-text-secondary;
    border-radius: 4rpx 4rpx 0 0;
    .active & {
      background: $color-primary;
    }
  }
}
</style>