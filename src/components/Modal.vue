<template>
  <view v-if="visible" class="modal-overlay" :class="{ 'modal-overlay-show': showOverlay }" @click="onOverlayClick">
    <view class="modal" :class="{ 'modal-show': showContent }" @click.stop>
      <view v-if="title" class="modal-header">
        <text class="modal-title">{{ title }}</text>
        <view v-if="closable" class="modal-close" @click="onClose">
          <text class="modal-close-icon">×</text>
        </view>
      </view>
      <view class="modal-body">
        <slot>
          <text v-if="content" class="modal-content">{{ content }}</text>
        </slot>
      </view>
      <view v-if="showFooter" class="modal-footer">
        <view v-if="showCancel" class="modal-btn modal-btn-cancel" @click="onCancel">
          <text>{{ cancelText }}</text>
        </view>
        <view class="modal-btn modal-btn-confirm" :class="[`modal-btn-${type}`]" @click="onConfirm">
          <text>{{ confirmText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  title?: string
  content?: string
  type?: 'primary' | 'success' | 'warning' | 'error'
  closable?: boolean
  maskClosable?: boolean
  showCancel?: boolean
  showFooter?: boolean
  confirmText?: string
  cancelText?: string
}>(), {
  modelValue: false,
  title: '',
  content: '',
  type: 'primary',
  closable: true,
  maskClosable: true,
  showCancel: true,
  showFooter: true,
  confirmText: '确定',
  cancelText: '取消'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

const visible = ref(false)
const showOverlay = ref(false)
const showContent = ref(false)

watch(() => props.modelValue, (val) => {
  if (val) {
    open()
  } else {
    close()
  }
}, { immediate: true })

function open() {
  visible.value = true
  setTimeout(() => { showOverlay.value = true }, 50)
  setTimeout(() => { showContent.value = true }, 100)
}

function close() {
  showContent.value = false
  showOverlay.value = false
  setTimeout(() => { visible.value = false }, 300)
}

function onClose() {
  emit('update:modelValue', false)
  emit('cancel')
}

function onOverlayClick() {
  if (props.maskClosable) {
    onClose()
  }
}

function onConfirm() {
  emit('update:modelValue', false)
  emit('confirm')
}

function onCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-overlay;
  z-index: $z-index-modal;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity $transition-normal;
}

.modal-overlay-show {
  opacity: 1;
}

.modal {
  background: $color-card;
  border-radius: $radius-xl;
  width: 580rpx;
  max-width: 90%;
  box-shadow: $shadow-modal;
  transform: scale(0.9);
  opacity: 0;
  transition: all $transition-normal;
}

.modal-show {
  transform: scale(1);
  opacity: 1;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-lg $spacing-lg $spacing-md;
}

.modal-title {
  font-size: $font-size-title;
  font-weight: $font-weight-semibold;
  color: $color-text;
}

.modal-close {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-circle;
}

.modal-close-icon {
  font-size: 36rpx;
  color: $color-text-weak;
  line-height: 1;
}

.modal-body {
  padding: 0 $spacing-lg $spacing-lg;
}

.modal-content {
  font-size: $font-size-body;
  color: $color-text-secondary;
  line-height: $line-height-relaxed;
}

.modal-footer {
  display: flex;
  padding: 0 $spacing-lg $spacing-lg;
  gap: $spacing-md;
}

.modal-btn {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-button;
  font-size: $font-size-heading;
  font-weight: $font-weight-medium;
  transition: all $transition-fast;

  &:active {
    transform: scale(0.98);
  }
}

.modal-btn-cancel {
  background: $color-bg-soft;
  color: $color-text-secondary;
  border: 2rpx solid $color-border;
}

.modal-btn-confirm {
  color: $color-text-inverse;
}

.modal-btn-primary { background: $gradient-primary; }
.modal-btn-success { background: $color-success; }
.modal-btn-warning { background: $color-warning; }
.modal-btn-error { background: $color-error; }
</style>