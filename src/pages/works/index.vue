<template>
  <view class="page">
    <NavBar title="我的作品" />
    
    <view class="tabs">
      <view 
        class="tab-item"
        :class="{ active: activeTab === 'drafts' }"
        @click="activeTab = 'drafts'"
      >
        <text>草稿箱</text>
        <view v-if="draftsCount > 0" class="tab-badge">{{ draftsCount }}</view>
      </view>
      <view 
        class="tab-item"
        :class="{ active: activeTab === 'published' }"
        @click="activeTab = 'published'"
      >
        <text>已发布</text>
        <view v-if="publishedCount > 0" class="tab-badge">{{ publishedCount }}</view>
      </view>
    </view>

    <scroll-view class="content" scroll-y>
      <view v-if="activeTab === 'drafts'" class="works-list">
        <view v-if="drafts.length === 0" class="empty-state">
          <text class="empty-icon">📋</text>
          <text class="empty-title">暂无草稿</text>
          <text class="empty-desc">开始创作你的第一个作品吧</text>
          <Button type="primary" @click="goCreate">去创作</Button>
        </view>
        
        <view v-else>
          <view 
            v-for="draft in drafts" 
            :key="draft._id"
            class="work-card"
            @click="goEditor(draft)"
          >
            <canvas canvas-id="draftCanvas{{ draft._id }}" class="work-image"></canvas>
            <view class="work-info">
              <view class="work-title">{{ draft.title || '未命名草稿' }}</view>
              <view class="work-meta">
                <text>{{ draft.canvas.width }}×{{ draft.canvas.height }}</text>
                <text>·</text>
                <text>{{ formatDate(draft.updatedAt) }}</text>
              </view>
            </view>
            <view class="work-actions">
              <view class="action-btn" @click.stop="editDraft(draft)">编辑</view>
              <view class="action-btn delete" @click.stop="deleteDraft(draft._id)">删除</view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="activeTab === 'published'" class="works-list">
        <view v-if="publishedWorks.length === 0" class="empty-state">
          <text class="empty-icon">🚀</text>
          <text class="empty-title">暂无发布作品</text>
          <text class="empty-desc">完成创作后发布到广场分享给大家</text>
          <Button type="primary" @click="goCreate">去创作</Button>
        </view>
        
        <view v-else>
          <view 
            v-for="work in publishedWorks" 
            :key="work._id"
            class="work-card"
            @click="goDetail(work._id)"
          >
            <image class="work-image" :src="work.thumbnail" mode="aspectFill" />
            <view class="work-info">
              <view class="work-title">{{ work.title }}</view>
              <view class="work-meta">
                <text>❤️ {{ work.stats.likes }}</text>
                <text>·</text>
                <text>👁️ {{ work.stats.views }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import NavBar from '@/components/NavBar.vue';
import Button from '@/components/Button.vue';

const activeTab = ref('drafts');

const drafts = ref([
  { _id: '1', title: '猫咪图案', canvas: { width: 29, height: 29 }, updatedAt: new Date() },
  { _id: '2', title: '', canvas: { width: 29, height: 19 }, updatedAt: new Date(Date.now() - 86400000) },
  { _id: '3', title: '风景插画', canvas: { width: 32, height: 32 }, updatedAt: new Date(Date.now() - 172800000) }
]);

const publishedWorks = ref([
  {
    _id: 'p1',
    title: '可爱猫咪',
    thumbnail: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20pixel%20art%20cat&image_size=square',
    stats: { likes: 128, views: 520 }
  },
  {
    _id: 'p2',
    title: '风景插画',
    thumbnail: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=pixel%20art%20landscape&image_size=square',
    stats: { likes: 89, views: 340 }
  }
]);

const draftsCount = computed(() => drafts.value.length);
const publishedCount = computed(() => publishedWorks.value.length);

function formatDate(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 7) return `${days}天前`;
  return new Date(date).toLocaleDateString();
}

function goCreate() {
  uni.switchTab({ url: '/pages/create/index' });
}

function goEditor(draft: { _id: string }) {
  uni.navigateTo({ url: `/pages/editor/index?id=${draft._id}` });
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/work-detail/index?id=${id}` });
}

function editDraft(draft: { _id: string }) {
  uni.navigateTo({ url: `/pages/editor/index?id=${draft._id}` });
}

function deleteDraft(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '删除后无法恢复，确定要删除吗？',
    success: (res) => {
      if (res.confirm) {
        drafts.value = drafts.value.filter(d => d._id !== id);
        uni.showToast({ title: '已删除', icon: 'success' });
      }
    }
  });
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $color-bg;
}

.tabs {
  display: flex;
  background: $color-card;
  padding: 0 24rpx;
  border-bottom: 2rpx solid $color-border;
}

.tab-item {
  flex: 1;
  padding: 24rpx 0;
  text-align: center;
  position: relative;
  font-size: 30rpx;
  color: $color-text-secondary;
  font-weight: 500;
  
  &.active {
    color: $color-primary;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 4rpx;
      background: $color-primary;
      border-radius: 2rpx;
    }
  }
}

.tab-badge {
  display: inline-block;
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 8rpx;
  background: $color-primary;
  color: #FFFFFF;
  font-size: 20rpx;
  border-radius: 16rpx;
  margin-left: 8rpx;
  line-height: 32rpx;
  text-align: center;
}

.content {
  height: calc(100vh - 196rpx);
  padding: 24rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  gap: 16rpx;
}

.empty-icon {
  font-size: 80rpx;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-text;
}

.empty-desc {
  font-size: 26rpx;
  color: $color-text-secondary;
}

.works-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.work-card {
  background: $color-card;
  border-radius: $radius-card;
  padding: 20rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: $shadow-card;
  
  &:active {
    transform: scale(0.98);
  }
}

.work-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: $radius-image;
  background: $color-bg;
}

.work-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.work-title {
  font-size: 28rpx;
  font-weight: 500;
  color: $color-text;
}

.work-meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: $color-text-secondary;
}

.work-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  padding: 12rpx 24rpx;
  background: $color-bg;
  border-radius: $radius-button;
  font-size: 24rpx;
  color: $color-text-secondary;
  
  &.delete {
    color: $color-error;
  }
}
</style>
