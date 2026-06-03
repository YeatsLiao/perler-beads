<template>
  <view v-if="visible" class="toast" :class="[`toast-${type}`, `toast-${position}`]">
    <view class="toast-content">
      <text class="toast-icon">{{ iconMap[type] }}</text>
      <text class="toast-message">{{ message }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  message?: string
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading'
  duration?: number
  position?: 'top' | 'center' | 'bottom'
}>(), {
  message: '',
  type: 'info',
  duration: 2000,
  position: 'center'
})

const iconMap: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
  loading: '◎'
}

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

function show(msg?: string, dur?: number) {
  if (timer) clearTimeout(timer)
  visible.value = true
  const duration = dur ?? props.duration
  if (duration > 0) {
    timer = setTimeout(() => { visible.value = false }, duration)
  }
}

function hide() {
  if (timer) clearTimeout(timer)
  visible.value = false
}

defineExpose({ show, hide })
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: $z-index-toast;
  animation: fadeInScale $transition-normal ease-out;
}

.toast-top { top: 120rpx; }
.toast-center { top: 50%; transform: translate(-50%, -50%); }
.toast-bottom { bottom: 200rpx; }

.toast-content {
  display: flex;
  align-items: center;
  padding: $spacing-md $spacing-xl;
  border-radius: $radius-lg;
  box-shadow: $shadow-float;
  gap: $spacing-sm;
  max-width: 80vw;
}

.toast-icon {
  font-size: $font-size-heading;
  flex-shrink: 0;
}

.toast-message {
  font-size: $font-size-body;
  color: $color-text;
  line-height: $line-height-normal;
}

.toast-success .toast-content { background: $color-success-light; }
.toast-success .toast-icon { color: $color-success; }

.toast-error .toast-content { background: $color-error-light; }
.toast-error .toast-icon { color: $color-error; }

.toast-warning .toast-content { background: $color-warning-light; }
.toast-warning .toast-icon { color: $color-warning; }

.toast-info .toast-content { background: $color-info-light; }
.toast-info .toast-icon { color: $color-info; }

.toast-loading .toast-content { background: rgba(74, 55, 40, 0.85); }
.toast-loading .toast-icon { color: $color-text-inverse; animation: spin 1s linear infinite; }
.toast-loading .toast-message { color: $color-text-inverse; }
</style>