<template>
  <view class="avatar" :class="[`avatar-${size}`, { 'avatar-round': round }]" :style="customStyle">
    <image v-if="src" class="avatar-image" :src="src" mode="aspectFill" />
    <text v-else class="avatar-text">{{ displayText }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  src?: string
  text?: string
  size?: 'small' | 'medium' | 'large'
  round?: boolean
  bgColor?: string
}>(), {
  src: '',
  text: '',
  size: 'medium',
  round: true
})

const displayText = computed(() => props.text ? props.text.charAt(0) : '')

const colorPool = [$color-peach-pink, $color-sky-blue, $color-mint, $color-lavender, $color-peach-orange, $color-cream-yellow]

const customStyle = computed(() => {
  if (props.src) return {}
  const bg = props.bgColor || colorPool[props.text.length % colorPool.length]
  return { background: bg }
})
</script>

<style lang="scss" scoped>
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border-radius: $radius-md;
}

.avatar-round {
  border-radius: $radius-circle;
}

.avatar-small {
  width: 48rpx;
  height: 48rpx;
}

.avatar-medium {
  width: 72rpx;
  height: 72rpx;
}

.avatar-large {
  width: 96rpx;
  height: 96rpx;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.avatar-text {
  font-size: $font-size-heading;
  font-weight: $font-weight-semibold;
  color: $color-text;
}
</style>