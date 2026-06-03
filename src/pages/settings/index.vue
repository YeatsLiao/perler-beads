<template>
  <view class="page">
    <NavBar title="设置" showBack />

    <scroll-view class="content" scroll-y>
      <view class="card">
        <view class="card-title">默认色板</view>
        <view class="palette-row">
          <view
            v-for="palette in palettes"
            :key="palette.id"
            class="palette-btn"
            :class="{ active: settings.defaultPaletteId === palette.id }"
            @click="updatePalette(palette.id)"
          >{{ palette.brandCn }}</view>
        </view>
      </view>

      <view class="card">
        <view class="card-title">默认画布尺寸</view>
        <view class="size-row">
          <view
            v-for="size in sizes"
            :key="size.label"
            class="size-btn"
            :class="{ active: settings.defaultWidth === size.width && settings.defaultHeight === size.height }"
            @click="updateSize(size.width, size.height)"
          >
            <text>{{ size.label }}</text>
            <text>{{ size.width }}×{{ size.height }}</text>
          </view>
        </view>
      </view>

      <view class="card">
        <view class="card-title">关于</view>
        <view class="info-row">
          <text>版本</text>
          <text>1.0.0</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import { PALETTES } from '@/constants/palettes';

const palettes = PALETTES;
const SETTINGS_KEY = 'userSettings';

const sizes = [
  { label: '方板', width: 29, height: 29 },
  { label: '横板', width: 29, height: 19 },
  { label: '迷你', width: 29, height: 10 },
  { label: '大图', width: 32, height: 32 }
];

const settings = reactive({
  defaultPaletteId: 'perler_80',
  defaultWidth: 29,
  defaultHeight: 29
});

onMounted(() => {
  try {
    const saved = uni.getStorageSync(SETTINGS_KEY);
    if (saved) {
      Object.assign(settings, saved);
    }
  } catch (_) {}
});

function saveSettings() {
  try {
    uni.setStorageSync(SETTINGS_KEY, { ...settings });
  } catch (_) {}
}

function updatePalette(id: string) {
  settings.defaultPaletteId = id;
  saveSettings();
}

function updateSize(width: number, height: number) {
  settings.defaultWidth = width;
  settings.defaultHeight = height;
  saveSettings();
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $color-bg;
}

.content {
  height: calc(100vh - 112rpx);
  padding: 136rpx 24rpx 132rpx;
}

.card {
  padding: 24rpx;
  border-radius: 26rpx;
  background: #FFFFFF;
  box-shadow: $shadow-card;
  margin-bottom: 22rpx;
}

.card-title {
  margin-bottom: 18rpx;
  font-size: 30rpx;
  font-weight: 900;
  color: $color-text;
}

.palette-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}

.palette-btn,
.size-btn {
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-bg;
  color: $color-text-secondary;
  font-size: 25rpx;
  font-weight: 900;
}

.palette-btn.active,
.size-btn.active {
  color: $color-primary;
  background: $color-primary-light;
  outline: 3rpx solid $color-primary;
}

.size-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12rpx;
}

.size-btn {
  flex-direction: column;
  height: 86rpx;
}

.size-btn text:first-child {
  font-size: 24rpx;
  font-weight: 900;
}

.size-btn text:last-child {
  font-size: 18rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: $color-text-secondary;
}

.info-row text:first-child {
  color: $color-text;
}
</style>
