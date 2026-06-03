<template>
  <view
    class="tag"
    :class="[`tag-${type}`, `tag-${size}`, { 'tag-round': round }]"
    :style="customStyle"
  >
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'small' | 'medium' | 'large'
  round?: boolean
  color?: string
  bgColor?: string
}>(), {
  type: 'default',
  size: 'medium',
  round: false
})

const customStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color) style.color = props.color
  if (props.bgColor) style.background = props.bgColor
  return style
})
</script>

<style lang="scss" scoped>
.tag {
  display: inline-flex;
  align-items: center;
  font-weight: $font-weight-medium;
  line-height: 1;
  white-space: nowrap;
}

.tag-small {
  font-size: $font-size-tiny;
  padding: 4rpx 10rpx;
  border-radius: $radius-xs;
}

.tag-medium {
  font-size: $font-size-small;
  padding: 6rpx 16rpx;
  border-radius: $radius-sm;
}

.tag-large {
  font-size: $font-size-secondary;
  padding: 8rpx 20rpx;
  border-radius: $radius-sm;
}

.tag-round {
  border-radius: 100rpx !important;
}

.tag-default {
  color: $color-text-secondary;
  background: $color-bg-soft;
}

.tag-primary {
  color: $color-primary;
  background: $color-primary-light;
}

.tag-success {
  color: $color-success-dark;
  background: $color-success-light;
}

.tag-warning {
  color: $color-warning-dark;
  background: $color-warning-light;
}

.tag-error {
  color: $color-error-dark;
  background: $color-error-light;
}

.tag-info {
  color: $color-info-dark;
  background: $color-info-light;
}
</style>