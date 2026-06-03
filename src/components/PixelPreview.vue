<template>
  <view
    class="pixel-preview"
    :class="{ compact, raised }"
    :style="previewStyle"
  >
    <view
      v-for="(row, rowIndex) in pattern"
      :key="rowIndex"
      class="pixel-row"
    >
      <view
        v-for="(cell, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        class="pixel-cell"
        :class="{ empty: !cell }"
        :style="{ backgroundColor: cell || 'transparent' }"
      ></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PixelPattern } from '@/utils/demoWorks';

const props = withDefaults(defineProps<{
  pattern: PixelPattern;
  background?: string;
  compact?: boolean;
  raised?: boolean;
}>(), {
  background: '#FFF8F0',
  compact: false,
  raised: false
});

const previewStyle = computed(() => ({
  background: props.background,
  '--columns': props.pattern[0]?.length || 1,
  '--rows': props.pattern.length || 1
}));
</script>

<style lang="scss" scoped>
.pixel-preview {
  width: 100%;
  aspect-ratio: var(--columns) / var(--rows);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 18rpx;
  box-sizing: border-box;
  border-radius: 18rpx;
  border: 2rpx solid rgba(255, 232, 217, 0.9);
  background-image: radial-gradient(circle, rgba(74, 55, 40, 0.08) 1rpx, transparent 1rpx);
  background-size: 18rpx 18rpx;
  overflow: hidden;
}

.pixel-preview.compact {
  padding: 10rpx;
  border-radius: 14rpx;
}

.pixel-preview.raised {
  box-shadow: 0 18rpx 36rpx rgba(255, 140, 105, 0.14);
}

.pixel-row {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: 3rpx;
  flex: 1;
}

.pixel-row + .pixel-row {
  margin-top: 3rpx;
}

.pixel-cell {
  min-width: 0;
  min-height: 0;
  border-radius: 24%;
  box-shadow: inset 0 -2rpx 0 rgba(74, 55, 40, 0.12), inset 0 2rpx 0 rgba(255, 255, 255, 0.28);
}

.pixel-cell.empty {
  box-shadow: none;
}
</style>
