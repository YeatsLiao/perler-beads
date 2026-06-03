<template>
  <view class="input-wrapper" :class="{ 'input-focused': focused, 'input-error': error, 'input-disabled': disabled }">
    <view v-if="$slots.prefix" class="input-prefix">
      <slot name="prefix"></slot>
    </view>
    <input
      class="input-field"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :placeholder-style="`color: ${$color-text-placeholder}`"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @confirm="onConfirm"
    />
    <view v-if="$slots.suffix || clearable" class="input-suffix">
      <view v-if="clearable && modelValue" class="input-clear" @click="onClear">
        <text class="clear-icon">×</text>
      </view>
      <slot name="suffix"></slot>
    </view>
  </view>
  <text v-if="error" class="input-error-text">{{ errorMessage }}</text>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  maxlength?: number
  error?: boolean
  errorMessage?: string
}>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  clearable: false,
  maxlength: 140,
  error: false,
  errorMessage: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
  confirm: []
  clear: []
}>()

const focused = ref(false)

function onInput(e: any) {
  emit('update:modelValue', e.detail.value)
}

function onFocus() {
  focused.value = true
  emit('focus')
}

function onBlur() {
  focused.value = false
  emit('blur')
}

function onConfirm() {
  emit('confirm')
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style lang="scss" scoped>
.input-wrapper {
  display: flex;
  align-items: center;
  background: $color-card;
  border-radius: $radius-input;
  padding: 0 $spacing-lg;
  border: 2rpx solid $color-border;
  transition: all $transition-fast;
  min-height: $touch-target-min;
}

.input-focused {
  border-color: $color-primary;
  box-shadow: 0 0 0 4rpx rgba(255, 122, 89, 0.1);
}

.input-error {
  border-color: $color-error;

  &.input-focused {
    box-shadow: 0 0 0 4rpx rgba(255, 117, 117, 0.1);
  }
}

.input-disabled {
  opacity: 0.5;
  background: $color-bg-soft;
}

.input-field {
  flex: 1;
  font-size: $font-size-body;
  color: $color-text;
  height: 80rpx;
  line-height: 80rpx;
}

.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.input-prefix {
  margin-right: $spacing-sm;
}

.input-suffix {
  margin-left: $spacing-sm;
}

.input-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36rpx;
  height: 36rpx;
  border-radius: $radius-circle;
  background: $color-text-weak;
}

.clear-icon {
  color: $color-text-inverse;
  font-size: $font-size-small;
  line-height: 1;
}

.input-error-text {
  font-size: $font-size-small;
  color: $color-error;
  margin-top: $spacing-xs;
  padding-left: $spacing-lg;
}
</style>