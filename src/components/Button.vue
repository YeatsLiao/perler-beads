<template>
  <view 
    class="btn" 
    :class="[`btn-${type}`, { 'btn-disabled': disabled }]"
    @click="handleClick"
  >
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();

function handleClick() {
  emit('click');
}
</script>

<style lang="scss" scoped>
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 48rpx;
  border-radius: $radius-button;
  font-size: $font-size-heading;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:active:not(.btn-disabled) {
    transform: scale(0.98);
  }
}

.btn-primary {
  background: $gradient-primary;
  color: #FFFFFF;
  box-shadow: $shadow-button;
}

.btn-secondary {
  background: $color-card;
  color: $color-primary;
  border: 2rpx solid $color-primary;
}

.btn-text {
  background: transparent;
  color: $color-text-secondary;
  padding: 16rpx 24rpx;
  font-size: $font-size-secondary;
}

.btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
