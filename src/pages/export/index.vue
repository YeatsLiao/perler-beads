<template>
  <view class="page">
    <NavBar title="导出" showBack />

    <scroll-view class="content" scroll-y>
      <view class="preview-card">
        <view class="preview-head">
          <text>{{ store.canvasWidth }}×{{ store.canvasHeight }}</text>
          <text>{{ store.beadCount }} 颗 · {{ store.usedColors }} 色</text>
        </view>
        <view class="preview-frame" :class="{ mirrored: flipHorizontal }">
          <PixelPreview :pattern="store.pixels" background="#FFFDF9" />
        </view>
      </view>

      <view class="card">
        <view class="card-title">格式</view>
        <view class="format-row">
          <view
            v-for="format in formats"
            :key="format"
            class="format-btn"
            :class="{ active: selectedFormat === format }"
            @click="selectedFormat = format"
          >{{ format.toUpperCase() }}</view>
        </view>
      </view>

      <view class="card">
        <view class="card-title">选项</view>
        <view class="option-row" @click="showGrid = !showGrid">
          <text>网格线</text>
          <switch :checked="showGrid" color="#FF7A59" />
        </view>
        <view class="option-row" @click="showColorId = !showColorId">
          <text>色号</text>
          <switch :checked="showColorId" color="#FF7A59" />
        </view>
        <view class="option-row" @click="flipHorizontal = !flipHorizontal">
          <text>镜像</text>
          <switch :checked="flipHorizontal" color="#FF7A59" />
        </view>
      </view>

      <view class="card">
        <view class="card-title">备料</view>
        <view v-if="store.materialStats.length === 0" class="empty">暂无颗粒</view>
        <view v-for="item in store.materialStats" :key="item.hex" class="material">
          <view class="dot" :style="{ background: item.hex }"></view>
          <text>{{ item.colorName || item.hex }}</text>
          <text>{{ item.count }} 颗</text>
        </view>
      </view>

      <view class="actions">
        <Button type="primary" @click="handleExport">保存图片</Button>
        <Button type="secondary" @click="copyList">复制备料</Button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavBar from '@/components/NavBar.vue';
import Button from '@/components/Button.vue';
import PixelPreview from '@/components/PixelPreview.vue';
import { useEditorStore } from '@/stores/editor';
import { ExportService } from '@/utils/exportService';
import { getPlatformAdapter } from '@/utils/platformAdapter';
import type { ExportOptions } from '@/types';

const store = useEditorStore();
const selectedFormat = ref<'png' | 'jpg' | 'pdf'>('png');
const showGrid = ref(true);
const showColorId = ref(false);
const flipHorizontal = ref(false);
const formats = ['png', 'jpg', 'pdf'] as const;

async function handleExport() {
  if (selectedFormat.value === 'pdf') {
    uni.showToast({ title: 'PDF导出功能即将上线，敬请期待', icon: 'none' });
    return;
  }

  if (store.beadCount === 0) {
    uni.showToast({ title: '画布为空，导出结果将为空白图片', icon: 'none' });
  }

  try {
    const exportService = new ExportService();
    const options: ExportOptions = {
      format: selectedFormat.value,
      scale: 28,
      showGrid: showGrid.value,
      showColorId: showColorId.value,
      flipHorizontal: flipHorizontal.value,
      background: 'white'
    };
    const dataUrl = await exportService.export(store.pixels, store.currentPalette, options);
    const adapter = getPlatformAdapter();
    await adapter.saveImage(dataUrl, `perler-pattern.${selectedFormat.value}`);
    uni.showToast({ title: '已保存', icon: 'success' });
  } catch (err: any) {
    const msg = err?.errMsg || '';
    if (msg.includes('auth') || msg.includes('permission')) {
      uni.showModal({
        title: '权限不足',
        content: '需要相册权限才能保存图片，请在系统设置中开启',
        showCancel: false
      });
    } else {
      uni.showToast({ title: '导出失败', icon: 'none' });
    }
  }
}

function copyList() {
  const text = store.materialStats
    .map(item => `${item.colorName || item.hex}(${item.hex}): ${item.count}颗`)
    .join('\n');
  uni.setClipboardData({
    data: text || '暂无颗粒',
    success: () => uni.showToast({ title: '已复制', icon: 'success' })
  });
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

.preview-card,
.card {
  padding: 24rpx;
  border-radius: 26rpx;
  background: #FFFFFF;
  box-shadow: $shadow-card;
  margin-bottom: 20rpx;
}

.preview-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 18rpx;
  font-size: 28rpx;
  font-weight: 900;
  color: $color-text;
}

.preview-head text:last-child {
  color: $color-primary;
}

.preview-frame {
  padding: 8rpx 36rpx;
}

.preview-frame.mirrored {
  transform: scaleX(-1);
}

.card-title {
  margin-bottom: 16rpx;
  font-size: 30rpx;
  font-weight: 900;
  color: $color-text;
}

.format-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.format-btn {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  background: $color-bg;
  color: $color-text-secondary;
  font-size: 25rpx;
  font-weight: 900;
}

.format-btn.active {
  background: $color-primary-light;
  color: $color-primary;
  outline: 3rpx solid $color-primary;
}

.option-row {
  min-height: 82rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2rpx solid $color-border;
  font-size: 28rpx;
  font-weight: 800;
  color: $color-text;
}

.option-row:last-child {
  border-bottom: none;
}

.material {
  display: flex;
  align-items: center;
  gap: 14rpx;
  min-height: 58rpx;
  font-size: 25rpx;
  color: $color-text;
}

.dot {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(74, 55, 40, 0.12);
}

.material text:nth-child(2) {
  flex: 1;
}

.material text:last-child {
  font-weight: 900;
  color: $color-primary;
}

.empty {
  padding: 20rpx 0;
  color: $color-text-secondary;
  font-size: 26rpx;
}

.actions {
  display: grid;
  gap: 16rpx;
}
</style>
