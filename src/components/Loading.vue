<template>
  <view class="loading" :class="[`loading-${type}`]">
    <view v-if="type === 'spinner'" class="loading-spinner">
      <view v-for="i in 8" :key="i" class="loading-dot" :style="{ transform: `rotate(${(i - 1) * 45}deg)` }">
        <view class="loading-dot-inner" :style="{ animationDelay: `${(i - 1) * 0.12}s` }"></view>
      </view>
    </view>
    <view v-if="type === 'circle'" class="loading-circle"></view>
    <view v-if="type === 'dots'" class="loading-dots">
      <view v-for="i in 3" :key="i" class="loading-dots-item" :style="{ animationDelay: `${(i - 1) * 0.2}s` }"></view>
    </view>
    <text v-if="text" class="loading-text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'spinner' | 'circle' | 'dots'
  text?: string
}>(), {
  type: 'spinner',
  text: ''
})
</script>

<style lang="scss" scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  position: relative;
}

.loading-dot {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.loading-dot-inner {
  width: 10rpx;
  height: 10rpx;
  border-radius: $radius-circle;
  background: $color-primary;
  position: absolute;
  top: 0;
  left: 50%;
  margin-left: -5rpx;
  animation: pulse 1s ease-in-out infinite;
}

.loading-circle {
  width: 48rpx;
  height: 48rpx;
  border: 4rpx solid $color-border;
  border-top-color: $color-primary;
  border-radius: $radius-circle;
  animation: spin 0.8s linear infinite;
}

.loading-dots {
  display: flex;
  gap: $spacing-sm;
}

.loading-dots-item {
  width: 12rpx;
  height: 12rpx;
  border-radius: $radius-circle;
  background: $color-primary;
  animation: bounce 0.6s ease-in-out infinite;
}

.loading-text {
  font-size: $font-size-secondary;
  color: $color-text-weak;
}
</style>