<template>
  <view class="empty">
    <view class="empty-icon">
      <slot name="icon">
        <text class="empty-icon-default">{{ defaultIcon }}</text>
      </slot>
    </view>
    <text class="empty-title">{{ title }}</text>
    <text v-if="description" class="empty-description">{{ description }}</text>
    <view v-if="$slots.action" class="empty-action">
      <slot name="action"></slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  type?: 'default' | 'search' | 'network' | 'permission'
}>(), {
  title: '暂无数据',
  description: '',
  type: 'default'
})

const iconMap: Record<string, string> = {
  default: '📭',
  search: '🔍',
  network: '📡',
  permission: '🔒'
}

const defaultIcon = computed(() => iconMap[props.type] || iconMap.default)
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-3xl $spacing-lg;
}

.empty-icon {
  margin-bottom: $spacing-lg;
}

.empty-icon-default {
  font-size: 80rpx;
}

.empty-title {
  font-size: $font-size-heading;
  color: $color-text-secondary;
  font-weight: $font-weight-medium;
  margin-bottom: $spacing-sm;
}

.empty-description {
  font-size: $font-size-secondary;
  color: $color-text-weak;
  text-align: center;
  line-height: $line-height-relaxed;
  max-width: 480rpx;
}

.empty-action {
  margin-top: $spacing-xl;
}
</style>