<template>
  <view class="card" :class="{ 'card-hover': hoverable }">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  hoverable?: boolean;
}>();
</script>

<style lang="scss" scoped>
.card {
  background: $color-card;
  border-radius: $radius-card;
  padding: $spacing-padding;
  box-shadow: $shadow-card;
  transition: all 0.2s ease;
}

.card-hover {
  &:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  }
}
</style>
