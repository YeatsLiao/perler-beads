<template>
  <view class="badge" :class="{ 'badge-dot': dot }">
    <slot></slot>
    <view v-if="!dot && showContent" class="badge-content" :class="[`badge-${type}`]">
      <text class="badge-text">{{ displayContent }}</text>
    </view>
    <view v-if="dot && showContent" class="badge-dot-indicator" :class="[`badge-dot-${type}`]"></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  content?: string | number
  max?: number
  dot?: boolean
  type?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  hidden?: boolean
}>(), {
  content: '',
  max: 99,
  dot: false,
  type: 'primary',
  hidden: false
})

const showContent = computed(() => !props.hidden && (props.dot || props.content !== '' && props.content !== 0))

const displayContent = computed(() => {
  if (typeof props.content === 'number' && props.content > props.max) {
    return `${props.max}+`
  }
  return String(props.content)
})
</script>

<style lang="scss" scoped>
.badge {
  position: relative;
  display: inline-flex;
}

.badge-content {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-index-base;
}

.badge-text {
  font-size: $font-size-tiny;
  color: $color-text-inverse;
  line-height: 1;
}

.badge-dot-indicator {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: $radius-circle;
  z-index: $z-index-base;
}

.badge-primary { background: $color-primary; }
.badge-success { background: $color-success; }
.badge-warning { background: $color-warning; }
.badge-error { background: $color-error; }
.badge-info { background: $color-info; }

.badge-dot-primary { background: $color-primary; }
.badge-dot-success { background: $color-success; }
.badge-dot-warning { background: $color-warning; }
.badge-dot-error { background: $color-error; }
.badge-dot-info { background: $color-info; }
</style>