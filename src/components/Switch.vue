<template>
  <view
    class="switch"
    :class="{ 'switch-active': modelValue, 'switch-disabled': disabled }"
    :style="{ background: modelValue ? activeColor : '' }"
    @click="onToggle"
  >
    <view class="switch-thumb" :class="{ 'switch-thumb-active': modelValue }"></view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: boolean
  disabled?: boolean
  activeColor?: string
}>(), {
  modelValue: false,
  disabled: false,
  activeColor: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
}>()

function onToggle() {
  if (props.disabled) return
  const newVal = !props.modelValue
  emit('update:modelValue', newVal)
  emit('change', newVal)
}
</script>

<style lang="scss" scoped>
.switch {
  width: 80rpx;
  height: 44rpx;
  background: $color-border;
  border-radius: 22rpx;
  position: relative;
  transition: background $transition-normal;
  flex-shrink: 0;
}

.switch-active {
  background: $color-primary;
}

.switch-disabled {
  opacity: 0.5;
}

.switch-thumb {
  width: 36rpx;
  height: 36rpx;
  background: $color-card;
  border-radius: $radius-circle;
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  box-shadow: $shadow-sm;
  transition: transform $transition-normal;
}

.switch-thumb-active {
  transform: translateX(36rpx);
}
</style>