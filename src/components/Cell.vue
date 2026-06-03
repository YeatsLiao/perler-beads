<template>
  <view class="cell" :class="{ 'cell-clickable': clickable, 'cell-disabled': disabled }" @click="onClick">
    <view v-if="$slots.icon || icon" class="cell-icon">
      <slot name="icon">
        <text>{{ icon }}</text>
      </slot>
    </view>
    <view class="cell-content">
      <text class="cell-title">{{ title }}</text>
      <text v-if="label" class="cell-label">{{ label }}</text>
    </view>
    <view class="cell-value">
      <slot>
        <text v-if="value" class="cell-value-text">{{ value }}</text>
      </slot>
    </view>
    <view v-if="isLink" class="cell-arrow">
      <text class="cell-arrow-icon">›</text>
    </view>
  </view>
</template>

<script setup lang="ts'>
const props = withDefaults(defineProps<{
  title?: string
  value?: string
  label?: string
  icon?: string
  isLink?: boolean
  clickable?: boolean
  disabled?: boolean
}>(), {
  title: '',
  value: '',
  label: '',
  icon: '',
  isLink: false,
  clickable: false,
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

function onClick() {
  if (props.disabled) return
  if (props.clickable || props.isLink) {
    emit('click')
  }
}
</script>

<style lang="scss" scoped>
.cell {
  display: flex;
  align-items: center;
  padding: $spacing-lg;
  min-height: $touch-target-min;
  background: $color-card;
  transition: background $transition-fast;
}

.cell-clickable {
  &:active {
    background: $color-bg-soft;
  }
}

.cell-disabled {
  opacity: 0.5;
}

.cell-icon {
  margin-right: $spacing-md;
  font-size: $font-size-heading;
  color: $color-primary;
  flex-shrink: 0;
}

.cell-content {
  flex: 1;
  min-width: 0;
}

.cell-title {
  font-size: $font-size-body;
  color: $color-text;
  line-height: $line-height-normal;
}

.cell-label {
  font-size: $font-size-small;
  color: $color-text-weak;
  margin-top: $spacing-xs;
}

.cell-value {
  flex-shrink: 0;
  margin-left: $spacing-md;
}

.cell-value-text {
  font-size: $font-size-body;
  color: $color-text-secondary;
}

.cell-arrow {
  margin-left: $spacing-xs;
  flex-shrink: 0;
}

.cell-arrow-icon {
  font-size: $font-size-title;
  color: $color-text-weak;
  line-height: 1;
}
</style>