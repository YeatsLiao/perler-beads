<template>
  <view class="page">
    <NavBar :title="work.title" showBack />

    <scroll-view class="content" scroll-y>
      <view class="preview-shell">
        <PixelPreview :pattern="work.pattern" raised background="#FFFDF9" />
      </view>

      <view class="info-card surface">
        <view class="author-row">
          <view class="author">
            <view class="avatar">{{ work.userInfo.nickname.slice(0, 1) }}</view>
            <view>
              <text class="author-name">{{ work.userInfo.nickname }}</text>
              <text class="author-level">{{ work.authorLevel }} · {{ formatDate(work.publishedAt) }}</text>
            </view>
          </view>
          <view class="follow" :class="{ active: isFollowed }" @click="toggleFollow">
            {{ isFollowed ? '已关注' : '关注' }}
          </view>
        </view>

        <text class="work-title">{{ work.title }}</text>
        <text class="work-desc">{{ work.description }}</text>

        <view class="meta-grid">
          <view>
            <text>{{ work.sketch.width }}×{{ work.sketch.height }}</text>
            <text>尺寸</text>
          </view>
          <view>
            <text>{{ work.sketch.colorCount }}</text>
            <text>颜色</text>
          </view>
          <view>
            <text>{{ beadTotal }}</text>
            <text>颗粒</text>
          </view>
        </view>

        <view class="tag-row">
          <text v-for="tag in work.tags" :key="tag">#{{ tag }}</text>
        </view>
      </view>

      <view class="palette-card surface">
        <view class="section-title">用色预估</view>
        <view class="material-list">
          <view v-for="item in materials" :key="item.hex" class="material-item">
            <view class="material-color" :style="{ background: item.hex }"></view>
            <view class="material-main">
              <text>{{ item.name }}</text>
              <view class="material-bar"><view :style="{ width: item.percent + '%' }"></view></view>
            </view>
            <text class="material-count">{{ item.count }} 颗</text>
          </view>
        </view>
      </view>

      <view class="stats-section surface">
        <view class="stat-item" @click="toggleLike">
          <text>{{ isLiked ? '♥' : '♡' }}</text>
          <text>{{ work.stats.likes + (isLiked ? 1 : 0) }}</text>
          <text>点赞</text>
        </view>
        <view class="stat-item" @click="toggleFavorite">
          <text>{{ isFavorited ? '★' : '☆' }}</text>
          <text>{{ work.stats.downloads + (isFavorited ? 1 : 0) }}</text>
          <text>收藏</text>
        </view>
        <view class="stat-item">
          <text>◉</text>
          <text>{{ work.stats.views }}</text>
          <text>浏览</text>
        </view>
      </view>

      <view class="actions">
        <Button type="primary" @click="reuseWork">复用创作</Button>
        <Button type="secondary" @click="downloadWork">下载图纸</Button>
      </view>

      <view class="comments surface">
        <view class="section-title">讨论</view>
        <view class="comment" v-for="comment in comments" :key="comment.id">
          <view class="comment-avatar">{{ comment.name.slice(0, 1) }}</view>
          <view>
            <view class="comment-head">
              <text>{{ comment.name }}</text>
              <text>{{ comment.time }}</text>
            </view>
            <text class="comment-text">{{ comment.text }}</text>
          </view>
        </view>
        <view class="comment-input">
          <input v-model="commentText" placeholder="写下制作心得..." />
          <view @click="sendComment">发送</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import NavBar from '@/components/NavBar.vue';
import Button from '@/components/Button.vue';
import PixelPreview from '@/components/PixelPreview.vue';
import { getDemoWork, demoWorks } from '@/utils/demoWorks';
import { draftStorage } from '@/utils/draftStorage';
import { ColorCounter } from '@/utils/colorCounter';
import { DEFAULT_PALETTE } from '@/constants/palettes';
import { useEditorStore } from '@/stores/editor';

const cc = new ColorCounter();
const store = useEditorStore();

const work = reactive(getDemoWork()) as ReturnType<typeof getDemoWork>;
const isLiked = ref(false);
const isFavorited = ref(false);
const isFollowed = ref(false);
const commentText = ref('');

const comments = ref([
  { id: '1', name: '手工爱好者', text: '这个色号搭配很舒服，准备周末照着做。', time: '1小时前' },
  { id: '2', name: '拼豆新手', text: '11×9 对新手太友好了，感谢分享。', time: '昨天' }
]);

const beadTotal = computed(() => work.pattern.flat().filter(Boolean).length);
const materials = computed(() => {
  const stats = cc.countColors(work.pattern, DEFAULT_PALETTE);
  return stats.map(s => ({
    hex: s.hex,
    count: s.count,
    name: s.colorName,
    percent: Math.round(s.percentage)
  }));
});

onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any).$page?.options || {};
  if (options.id) {
    const draft = draftStorage.loadDraft(options.id);
    if (draft) {
      Object.assign(work, {
        _id: draft._id,
        title: draft.title,
        description: '',
        pattern: draft.pixels,
        sketch: { width: draft.width, height: draft.height, pixelSize: 10, paletteId: draft.paletteId, colorCount: 0 },
        stats: { likes: 0, views: 0, downloads: 0, comments: 0 },
        userInfo: { nickname: '我', avatar: '' },
        tags: [],
        category: 'other',
        authorLevel: '',
        publishedAt: new Date(draft.createdAt)
      });
    } else {
      const selected = getDemoWork(options.id);
      Object.assign(work, selected);
    }
  }
});

function formatDate(date?: Date) {
  if (!date) return '刚刚';
  const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000));
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  return `${days} 天前`;
}

function toggleLike() {
  isLiked.value = !isLiked.value;
}

function toggleFavorite() {
  isFavorited.value = !isFavorited.value;
}

function toggleFollow() {
  isFollowed.value = !isFollowed.value;
}

function reuseWork() {
  store.loadPixels(work.pattern);
  uni.navigateTo({ url: `/pages/editor/index?id=${work._id}` });
}

function downloadWork() {
  store.loadPixels(work.pattern);
  uni.navigateTo({ url: `/pages/export/index` });
}

function sendComment() {
  if (!commentText.value.trim()) return;
  comments.value.unshift({ id: `${Date.now()}`, name: '我', text: commentText.value, time: '刚刚' });
  commentText.value = '';
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 183, 197, 0.22), transparent 34%),
    $color-bg;
}

.content {
  height: calc(100vh - 112rpx);
  padding: 136rpx 24rpx 132rpx;
}

.preview-shell {
  margin-bottom: 22rpx;
  padding: 18rpx 36rpx;
}

.info-card,
.palette-card,
.stats-section,
.comments {
  padding: 24rpx;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
}

.author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.author {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.avatar,
.comment-avatar {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  background: $gradient-warm;
  color: $color-text;
  font-weight: 900;
}

.author-name {
  display: block;
  font-size: 27rpx;
  font-weight: 800;
  color: $color-text;
}

.author-level {
  display: block;
  margin-top: 4rpx;
  font-size: 22rpx;
  color: $color-text-secondary;
}

.follow {
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  background: $color-primary;
  color: #FFFFFF;
  font-size: 23rpx;
  font-weight: 800;
}

.follow.active {
  background: $color-bg;
  color: $color-text-secondary;
}

.work-title {
  display: block;
  font-size: 38rpx;
  font-weight: 900;
  color: $color-text;
}

.work-desc {
  display: block;
  margin-top: 12rpx;
  font-size: 26rpx;
  color: $color-text-secondary;
  line-height: 1.55;
}

.meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
  margin-top: 22rpx;
}

.meta-grid view {
  padding: 18rpx;
  border-radius: 18rpx;
  background: $color-bg;
  text-align: center;
}

.meta-grid text:first-child {
  display: block;
  font-size: 28rpx;
  font-weight: 900;
  color: $color-primary;
}

.meta-grid text:last-child {
  display: block;
  margin-top: 4rpx;
  font-size: 20rpx;
  color: $color-text-secondary;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  margin-top: 18rpx;
}

.tag-row text {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: $color-primary-light;
  color: $color-primary;
  font-size: 21rpx;
  font-weight: 800;
}

.section-title {
  margin-bottom: 18rpx;
  font-size: 29rpx;
  font-weight: 900;
  color: $color-text;
}

.material-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.material-color {
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  border: 2rpx solid rgba(74, 55, 40, 0.1);
}

.material-main {
  flex: 1;
}

.material-main text {
  display: block;
  margin-bottom: 7rpx;
  font-size: 21rpx;
  color: $color-text-secondary;
}

.material-bar {
  height: 10rpx;
  border-radius: 999rpx;
  background: $color-bg;
  overflow: hidden;
}

.material-bar view {
  height: 100%;
  border-radius: inherit;
  background: $gradient-primary;
}

.material-count {
  width: 86rpx;
  text-align: right;
  font-size: 22rpx;
  color: $color-text;
  font-weight: 800;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rpx;
  padding: 14rpx;
  border-radius: 18rpx;
  background: $color-bg;
}

.stat-item text:first-child {
  font-size: 34rpx;
  color: $color-primary;
}

.stat-item text:nth-child(2) {
  font-size: 27rpx;
  font-weight: 900;
  color: $color-text;
}

.stat-item text:last-child {
  font-size: 20rpx;
  color: $color-text-secondary;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.comment {
  display: grid;
  grid-template-columns: 56rpx 1fr;
  gap: 14rpx;
  padding: 14rpx 0;
}

.comment-avatar {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  font-size: 22rpx;
}

.comment-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6rpx;
  font-size: 22rpx;
  color: $color-text-secondary;
}

.comment-head text:first-child {
  color: $color-text;
  font-weight: 800;
}

.comment-text {
  font-size: 25rpx;
  color: $color-text;
  line-height: 1.45;
}

.comment-input {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
  padding-top: 18rpx;
  border-top: 2rpx solid $color-border;
}

.comment-input input {
  flex: 1;
  height: 70rpx;
  padding: 0 20rpx;
  border-radius: 18rpx;
  background: $color-bg;
  font-size: 25rpx;
}

.comment-input view {
  width: 98rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18rpx;
  background: $color-primary;
  color: #FFFFFF;
  font-size: 24rpx;
  font-weight: 800;
}
</style>
