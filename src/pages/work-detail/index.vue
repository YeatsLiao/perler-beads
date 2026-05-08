<template>
  <view class="page">
    <NavBar :title="work?.title || '作品详情'" showBack />
    
    <scroll-view class="content" scroll-y>
      <view class="work-image-container">
        <image class="work-image" :src="work?.thumbnail" mode="aspectFit" />
      </view>

      <view class="work-info">
        <view class="info-row">
          <view class="author-info">
            <view class="author-avatar">👤</view>
            <view class="author-detail">
              <text class="author-name">{{ work?.userInfo.nickname }}</text>
              <text class="publish-time">{{ formatDate(work?.publishedAt) }}</text>
            </view>
          </view>
          <view class="follow-btn" @click="toggleFollow">
            <text>{{ isFollowed ? '已关注' : '关注' }}</text>
          </view>
        </view>

        <view class="work-title">{{ work?.title }}</view>
        <view class="work-desc">{{ work?.description || '暂无描述' }}</view>
        
        <view class="work-meta">
          <view class="meta-item">
            <text class="meta-icon">📐</text>
            <text class="meta-text">{{ work?.sketch.width }}×{{ work?.sketch.height }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-icon">🎨</text>
            <text class="meta-text">{{ work?.sketch.colorCount }}色</text>
          </view>
          <view class="meta-item">
            <text class="meta-icon">🏷️</text>
            <text class="meta-text">{{ work?.tags.join(' ') }}</text>
          </view>
        </view>
      </view>

      <view class="stats-section">
        <view class="stat-item" @click="toggleLike">
          <text class="stat-icon">{{ isLiked ? '❤️' : '🤍' }}</text>
          <text class="stat-value">{{ work?.stats.likes + (isLiked ? 1 : 0) }}</text>
          <text class="stat-label">点赞</text>
        </view>
        <view class="stat-item" @click="toggleFavorite">
          <text class="stat-icon">{{ isFavorited ? '⭐' : '☆' }}</text>
          <text class="stat-value">{{ work?.stats.likes }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item">
          <text class="stat-icon">👁️</text>
          <text class="stat-value">{{ work?.stats.views }}</text>
          <text class="stat-label">浏览</text>
        </view>
        <view class="stat-item">
          <text class="stat-icon">💬</text>
          <text class="stat-value">{{ work?.stats.comments }}</text>
          <text class="stat-label">评论</text>
        </view>
      </view>

      <view class="actions-section">
        <Button type="primary" @click="downloadWork">下载图纸</Button>
        <Button type="secondary" @click="shareWork">分享作品</Button>
      </view>

      <view class="comments-section">
        <view class="section-title">评论 ({{ work?.stats.comments }})</view>
        
        <view v-if="comments.length === 0" class="empty-comments">
          <text class="empty-icon">💬</text>
          <text class="empty-text">暂无评论，快来发表第一条评论吧</text>
        </view>
        
        <view v-else class="comments-list">
          <view 
            v-for="comment in comments" 
            :key="comment._id"
            class="comment-item"
          >
            <view class="comment-avatar">👤</view>
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-author">{{ comment.userInfo.nickname }}</text>
                <text class="comment-time">{{ formatDate(comment.createdAt) }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-actions">
                <text class="action-item" @click="likeComment(comment._id)">
                  ❤️ {{ comment.likes }}
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="comment-input">
          <input 
            class="input-field" 
            placeholder="写下你的评论..." 
            v-model="commentText"
          />
          <view class="send-btn" @click="sendComment">发送</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import Button from '@/components/Button.vue';

const work = ref({
  _id: '1',
  title: '可爱猫咪',
  thumbnail: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=cute%20pixel%20art%20cat%20portrait&image_size=square',
  userInfo: { nickname: '手作达人', avatar: '' },
  description: '用拼豆制作的可爱猫咪图案，适合送给喜欢猫咪的朋友~',
  sketch: { width: 29, height: 29, pixelSize: 10, paletteId: 'perler_80', colorCount: 5 },
  tags: ['猫咪', '可爱', '宠物'],
  stats: { likes: 128, views: 520, downloads: 64, comments: 3 },
  publishedAt: new Date(Date.now() - 86400000)
});

const comments = ref([
  {
    _id: 'c1',
    userInfo: { nickname: '手工爱好者', avatar: '' },
    content: '太可爱了！这个配色好舒服',
    likes: 12,
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    _id: 'c2',
    userInfo: { nickname: '创意玩家', avatar: '' },
    content: '求教程！想学着做一个',
    likes: 8,
    createdAt: new Date(Date.now() - 7200000)
  },
  {
    _id: 'c3',
    userInfo: { nickname: '拼豆新手', avatar: '' },
    content: '请问用的是什么品牌的豆子呀？',
    likes: 5,
    createdAt: new Date(Date.now() - 10800000)
  }
]);

const isLiked = ref(false);
const isFavorited = ref(false);
const isFollowed = ref(false);
const commentText = ref('');

onMounted(() => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any).$page?.options || {};
  if (options.id) {
    console.log('Work ID:', options.id);
  }
});

function formatDate(date?: Date) {
  if (!date) return '';
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  return new Date(date).toLocaleDateString();
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

function downloadWork() {
  uni.showToast({ title: '下载成功', icon: 'success' });
}

function shareWork() {
  uni.showShareMenu({
    withShareTicket: true,
    success: () => {
      uni.showToast({ title: '分享成功', icon: 'success' });
    }
  });
}

function sendComment() {
  if (!commentText.value.trim()) return;
  
  comments.value.unshift({
    _id: `c${Date.now()}`,
    userInfo: { nickname: '我', avatar: '' },
    content: commentText.value,
    likes: 0,
    createdAt: new Date()
  });
  
  commentText.value = '';
  uni.showToast({ title: '评论成功', icon: 'success' });
}

function likeComment(id: string) {
  const comment = comments.value.find(c => c._id === id);
  if (comment) {
    comment.likes++;
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $color-bg;
}

.content {
  height: calc(100vh - 112rpx);
}

.work-image-container {
  background: $color-card;
  padding: 24rpx;
}

.work-image {
  width: 100%;
  max-height: 600rpx;
  border-radius: $radius-card;
}

.work-info {
  background: $color-card;
  margin: 24rpx;
  border-radius: $radius-card;
  padding: 24rpx;
  box-shadow: $shadow-card;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.author-avatar {
  width: 72rpx;
  height: 72rpx;
  background: $color-bg;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
}

.author-detail {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.author-name {
  font-size: 28rpx;
  font-weight: 500;
  color: $color-text;
}

.publish-time {
  font-size: 24rpx;
  color: $color-text-weak;
}

.follow-btn {
  padding: 12rpx 32rpx;
  background: $color-primary;
  border-radius: $radius-button;
  font-size: 26rpx;
  color: #FFFFFF;
  
  &:active {
    opacity: 0.8;
  }
}

.work-title {
  font-size: 36rpx;
  font-weight: 600;
  color: $color-text;
  margin-bottom: 12rpx;
}

.work-desc {
  font-size: 28rpx;
  color: $color-text-secondary;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.work-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: $color-bg;
  border-radius: $radius-button;
}

.meta-icon {
  font-size: 24rpx;
}

.meta-text {
  font-size: 24rpx;
  color: $color-text-secondary;
}

.stats-section {
  display: flex;
  justify-content: space-around;
  margin: 0 24rpx;
  background: $color-card;
  border-radius: $radius-card;
  padding: 24rpx;
  box-shadow: $shadow-card;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  
  &:active {
    opacity: 0.7;
  }
}

.stat-icon {
  font-size: 40rpx;
}

.stat-value {
  font-size: 32rpx;
  font-weight: 600;
  color: $color-text;
}

.stat-label {
  font-size: 24rpx;
  color: $color-text-secondary;
}

.actions-section {
  display: flex;
  gap: 20rpx;
  margin: 24rpx;
}

.actions-section .btn {
  flex: 1;
}

.comments-section {
  margin: 0 24rpx 24rpx;
  background: $color-card;
  border-radius: $radius-card;
  padding: 24rpx;
  box-shadow: $shadow-card;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text;
  margin-bottom: 20rpx;
}

.empty-comments {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 0;
  gap: 12rpx;
}

.empty-icon {
  font-size: 64rpx;
}

.empty-text {
  font-size: 26rpx;
  color: $color-text-secondary;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.comment-item {
  display: flex;
  gap: 16rpx;
}

.comment-avatar {
  width: 56rpx;
  height: 56rpx;
  background: $color-bg;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.comment-author {
  font-size: 26rpx;
  font-weight: 500;
  color: $color-text;
}

.comment-time {
  font-size: 22rpx;
  color: $color-text-weak;
}

.comment-text {
  font-size: 28rpx;
  color: $color-text;
  line-height: 1.5;
}

.comment-actions {
  margin-top: 12rpx;
}

.action-item {
  font-size: 24rpx;
  color: $color-text-secondary;
  
  &:active {
    color: $color-primary;
  }
}

.comment-input {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2rpx solid $color-border;
}

.input-field {
  flex: 1;
  padding: 20rpx 24rpx;
  background: $color-bg;
  border-radius: $radius-button;
  font-size: 28rpx;
}

.send-btn {
  padding: 20rpx 32rpx;
  background: $color-primary;
  border-radius: $radius-button;
  font-size: 28rpx;
  color: #FFFFFF;
  
  &:active {
    opacity: 0.8;
  }
}
</style>
