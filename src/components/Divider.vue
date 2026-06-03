<template>
  <view class="divider" :class="[`divider-${direction}`]">
    <view v-if="direction === 'horizontal'" class="divider-line" :style="lineStyle">
      <text v-if="text" class="divider-text">{{ text }}</text>
    </view>
    <view v-else class="divider-line-vertical" :style="lineStyle"></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  text?: string
  direction?: 'horizontal' | 'vertical'
  color?: string
  margin?: string
}>(), {
  text: '',
  direction: 'horizontal',
  color: '',
  margin: ''
})

const lineStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.color) style.borderColor = props.color
  if (props.margin) style.margin = props.margin
  return style
})
</script>

<style lang="scss" scoped>
.divider {
  width: 100%;
}

.divider-horizontal {
  padding: 0;
}

.divider-line {
  display: flex;
  align-items: center;
  border-top: 2rpx solid $color-divider;
  margin: $spacing-md 0;
}

.divider-text {
  font-size: $font-size-small;
  color: $color-text-weak;
  padding: 0 $spacing-md;
  background: $color-bg;
}

.divider-line-vertical {
  width: 2rpx;
  height: 100%;
  min-height: 32rpx;
  background: $color-divider;
  margin: 0 $spacing-md;
}
</style>