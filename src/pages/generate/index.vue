<template>
  <view class="page">
    <NavBar title="照片转图纸" showBack />

    <scroll-view class="content" scroll-y>
      <view class="upload-box" @click="chooseImage">
        <image v-if="imageSrc" class="source-image" :src="imageSrc" mode="aspectFill" />
        <view v-else class="upload-empty">
          <text>＋</text>
          <text>选择照片</text>
        </view>
      </view>

      <view class="control-card">
        <view class="size-row">
          <view
            v-for="size in sizes"
            :key="size.label"
            class="size-btn"
            :class="{ active: gridWidth === size.width && gridHeight === size.height }"
            @click="setSize(size.width, size.height)"
          >
            <text>{{ size.label }}</text>
            <text>{{ size.width }}×{{ size.height }}</text>
          </view>
        </view>

        <view class="slider-row">
          <view class="slider-head">
            <text>颜色数量</text>
            <text>{{ colorLimit }} 色</text>
          </view>
          <slider v-model="colorLimit" :min="6" :max="36" :step="2" activeColor="#FF7A59" backgroundColor="#FFE8D9" />
        </view>

        <view class="palette-row">
          <view
            v-for="palette in palettes"
            :key="palette.id"
            class="palette-btn"
            :class="{ active: selectedPalette === palette.id }"
            @click="selectedPalette = palette.id"
          >{{ palette.brandCn }}</view>
        </view>
      </view>

      <view class="preview-card">
        <view class="preview-title">
          <text>预览</text>
          <text>{{ generatedPattern.length ? `${gridWidth}×${gridHeight}` : '未生成' }}</text>
        </view>
        <PixelPreview :pattern="previewPattern" background="#FFFDF9" />
      </view>

      <view class="actions">
        <Button type="secondary" @click="generatePreview">生成预览</Button>
        <Button type="primary" @click="openEditor">进入编辑</Button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import NavBar from '@/components/NavBar.vue';
import Button from '@/components/Button.vue';
import PixelPreview from '@/components/PixelPreview.vue';
import { PALETTES } from '@/constants/palettes';
import { useEditorStore } from '@/stores/editor';
import { createCheckerPattern, demoWorks, type PixelPattern } from '@/utils/demoWorks';
import { PixelProcessor } from '@/utils/pixelProcessor';
import { getPlatformAdapter } from '@/utils/platformAdapter';

const store = useEditorStore();
const imageSrc = ref('');
const gridWidth = ref(29);
const gridHeight = ref(29);
const colorLimit = ref(18);
const selectedPalette = ref(PALETTES[0].id);
const generatedPattern = ref<PixelPattern>([]);
const palettes = PALETTES;

const sizes = [
  { label: '方板', width: 29, height: 29 },
  { label: '横板', width: 29, height: 19 },
  { label: '大图', width: 32, height: 32 }
];

const activePalette = computed(() => PALETTES.find(item => item.id === selectedPalette.value) || PALETTES[0]);
const previewPattern = computed(() => generatedPattern.value.length ? generatedPattern.value : demoWorks[1].pattern);

function setSize(width: number, height: number) {
  gridWidth.value = width;
  gridHeight.value = height;
}

function chooseImage() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      imageSrc.value = res.tempFilePaths[0];
      generatePreview();
    }
  });
}

async function generatePreview() {
  if (!imageSrc.value) {
    generatedPattern.value = createCheckerPattern(gridWidth.value > 29 ? 16 : 12);
    uni.showToast({ title: '已生成示例', icon: 'none' });
    return;
  }

  try {
    generatedPattern.value = await pixelateImage(imageSrc.value);
  } catch (_) {
    generatedPattern.value = createCheckerPattern(12);
    uni.showToast({ title: '预览失败，已使用示例', icon: 'none' });
  }
}

function openEditor() {
  if (!generatedPattern.value.length) {
    generatedPattern.value = createCheckerPattern(12);
  }
  store.setPalette(activePalette.value);
  store.loadPixels(generatedPattern.value);
  uni.navigateTo({ url: '/pages/editor/index?source=generate' });
}

async function pixelateImage(src: string): Promise<PixelPattern> {
  const adapter = getPlatformAdapter();
  const imageData = await adapter.getImageData(src, gridWidth.value, gridHeight.value);
  const limitedPalette = activePalette.value.colors.slice(0, colorLimit.value);
  const processor = new PixelProcessor(limitedPalette);
  return processor.pixelate(imageData, gridWidth.value, gridHeight.value, 1);
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

.upload-box {
  height: 360rpx;
  border-radius: 28rpx;
  background: #FFFFFF;
  border: 4rpx dashed $color-border;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22rpx;
}

.source-image {
  width: 100%;
  height: 100%;
}

.upload-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  color: $color-primary;
  font-size: 34rpx;
  font-weight: 900;
}

.upload-empty text:first-child {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-primary-light;
  font-size: 58rpx;
}

.control-card,
.preview-card {
  padding: 24rpx;
  border-radius: 26rpx;
  background: #FFFFFF;
  box-shadow: $shadow-card;
  margin-bottom: 22rpx;
}

.size-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin-bottom: 22rpx;
}

.size-btn,
.palette-btn {
  height: 86rpx;
  border-radius: 18rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $color-bg;
  color: $color-text-secondary;
}

.size-btn.active,
.palette-btn.active {
  color: $color-primary;
  background: $color-primary-light;
  outline: 3rpx solid $color-primary;
}

.size-btn text:first-child {
  font-size: 26rpx;
  font-weight: 900;
}

.size-btn text:last-child {
  font-size: 20rpx;
}

.slider-row {
  margin-bottom: 20rpx;
}

.slider-head,
.preview-title {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  font-weight: 900;
  color: $color-text;
}

.slider-head text:last-child,
.preview-title text:last-child {
  color: $color-primary;
}

.palette-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}

.palette-btn {
  height: 68rpx;
  font-size: 25rpx;
  font-weight: 900;
}

.preview-title {
  margin-bottom: 18rpx;
}

.actions {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16rpx;
}
</style>
