<template>
  <view class="page">
    <NavBar title="我的作品" />

    <scroll-view class="content" scroll-y>
      <view class="summary surface">
        <view>
          <text class="summary-title">我的创作库</text>
          <text class="summary-desc">草稿、已发布图纸和备料记录都可以从这里继续。</text>
        </view>
        <view class="summary-stats">
          <view>
            <text>{{ drafts.length }}</text>
            <text>草稿</text>
          </view>
          <view>
            <text>{{ publishedWorks.length }}</text>
            <text>发布</text>
          </view>
        </view>
      </view>

      <view class="tabs surface">
        <view
          class="tab-item"
          :class="{ active: activeTab === 'drafts' }"
          @click="activeTab = 'drafts'"
        >草稿箱</view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'published' }"
          @click="activeTab = 'published'"
        >已发布</view>
      </view>

      <view v-if="activeTab === 'drafts'" class="works-list">
        <view
          v-for="draft in drafts"
          :key="draft._id"
          class="draft-card surface"
          @click="goEditor(draft._id)"
        >
          <PixelPreview :pattern="draft.pattern" compact background="#FFFDF9" />
          <view class="draft-info">
            <view class="draft-title">{{ draft.title }}</view>
            <view class="draft-meta">{{ draft.size }} · {{ draft.updated }}</view>
            <view class="draft-actions">
              <view @click.stop="goEditor(draft._id)">继续编辑</view>
              <view class="delete" @click.stop="deleteDraft(draft._id)">删除</view>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="published-grid">
        <view
          v-for="work in publishedWorks"
          :key="work._id"
          class="published-card surface"
          @click="goDetail(work._id)"
        >
          <PixelPreview :pattern="work.pattern" compact background="#FFFDF9" />
          <view class="published-title">{{ work.title }}</view>
          <view class="published-meta">
            <text>❤️ {{ work.stats.likes }}</text>
            <text>👁 {{ work.stats.views }}</text>
          </view>
        </view>
      </view>

      <view class="new-card" @click="goCreate">
        <text>＋</text>
        <text>新建图纸</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import PixelPreview from '@/components/PixelPreview.vue';
import { demoWorks, type PixelPattern } from '@/utils/demoWorks';
import { draftStorage, type DraftData } from '@/utils/draftStorage';
import { useEditorStore } from '@/stores/editor';

const activeTab = ref<'drafts' | 'published'>('drafts');
const store = useEditorStore();

interface DraftItem {
  _id: string;
  title: string;
  size: string;
  updated: string;
  pattern: PixelPattern;
}

const drafts = ref<DraftItem[]>([]);
const publishedWorks = demoWorks;

onMounted(() => {
  loadDrafts();
});

function loadDrafts() {
  const draftList = draftStorage.loadAllDrafts();
  drafts.value = draftList.map(d => ({
    _id: d._id,
    title: d.title,
    size: `${d.width}×${d.height}`,
    updated: formatTime(d.updatedAt),
    pattern: d.pixels
  }));
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return new Date(timestamp).toLocaleDateString('zh-CN');
}

function goCreate() {
  uni.switchTab({ url: '/pages/create/index' });
}

function goEditor(id: string) {
  uni.navigateTo({ url: `/pages/editor/index?source=draft&id=${id}` });
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/work-detail/index?id=${id}` });
}

function deleteDraft(id: string) {
  uni.showModal({
    title: '删除草稿',
    content: '删除后无法恢复，确定继续吗？',
    success: (res) => {
      if (res.confirm) {
        draftStorage.deleteDraft(id);
        drafts.value = drafts.value.filter(item => item._id !== id);
        uni.showToast({ title: '已删除', icon: 'success' });
      }
    }
  });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 90% 2%, rgba(184, 224, 210, 0.28), transparent 30%),
    $color-bg;
}

.content {
  height: calc(100vh - 112rpx);
  padding: 136rpx 24rpx 132rpx;
}

.summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24rpx;
  padding: 28rpx;
  border-radius: $radius-large;
  margin-bottom: 18rpx;
}

.summary-title {
  display: block;
  font-size: 36rpx;
  font-weight: 900;
  color: $color-text;
}

.summary-desc {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  line-height: 1.45;
  color: $color-text-secondary;
}

.summary-stats {
  display: flex;
  gap: 12rpx;
}

.summary-stats view {
  width: 86rpx;
  height: 86rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20rpx;
  background: $color-bg;
}

.summary-stats text:first-child {
  font-size: 30rpx;
  font-weight: 900;
  color: $color-primary;
}

.summary-stats text:last-child {
  font-size: 20rpx;
  color: $color-text-secondary;
}

.tabs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 8rpx;
  border-radius: 22rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  font-size: 25rpx;
  font-weight: 800;
  color: $color-text-secondary;
}

.tab-item.active {
  color: $color-primary;
  background: $color-primary-light;
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.draft-card {
  display: grid;
  grid-template-columns: 170rpx 1fr;
  gap: 18rpx;
  padding: 18rpx;
  border-radius: 24rpx;
}

.draft-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 9rpx;
}

.draft-title,
.published-title {
  font-size: 27rpx;
  font-weight: 800;
  color: $color-text;
}

.draft-meta {
  font-size: 23rpx;
  color: $color-text-secondary;
}

.draft-actions {
  display: flex;
  gap: 12rpx;
  margin-top: 6rpx;
}

.draft-actions view {
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  background: $color-bg;
  color: $color-primary;
  font-size: 22rpx;
  font-weight: 800;
}

.draft-actions .delete {
  color: $color-error;
}

.published-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.published-card {
  padding: 16rpx;
  border-radius: 24rpx;
}

.published-title {
  margin-top: 14rpx;
}

.published-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: $color-text-secondary;
}

.new-card {
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  margin-top: 22rpx;
  border-radius: 24rpx;
  color: #FFFFFF;
  background: $gradient-primary;
  box-shadow: $shadow-button;
  font-size: 28rpx;
  font-weight: 900;
}
</style>
