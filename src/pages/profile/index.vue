<template>
  <view class="page">
    <NavBar title="个人中心" />
    
    <scroll-view class="content" scroll-y>
      <view class="profile-header">
        <view class="avatar-container">
          <view class="avatar">👤</view>
          <view class="edit-avatar">📷</view>
        </view>
        <view class="user-info">
          <text class="username">手作达人</text>
          <text class="user-desc">热爱拼豆创作的手工爱好者</text>
        </view>
        <view class="user-stats">
          <view class="stat-item">
            <text class="stat-value">12</text>
            <text class="stat-label">作品</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-value">89</text>
            <text class="stat-label">粉丝</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-value">156</text>
            <text class="stat-label">获赞</text>
          </view>
        </view>
      </view>

      <view class="menu-section">
        <view class="menu-item" @click="goSettings">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goAbout">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goFeedback">
          <text class="menu-icon">💬</text>
          <text class="menu-text">意见反馈</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goPrivacy">
          <text class="menu-icon">🔒</text>
          <text class="menu-text">隐私政策</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goTerms">
          <text class="menu-icon">📄</text>
          <text class="menu-text">用户协议</text>
          <text class="menu-arrow">→</text>
        </view>
      </view>

      <view class="app-info">
        <text class="app-name">想想手作</text>
        <text class="app-version">版本 1.0.0</text>
        <text class="app-copyright">© 2026 XiangXiang Crafts</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';

function goSettings() {
  uni.navigateTo({ url: '/pages/settings/index' });
}

function goAbout() {
  uni.showModal({
    title: '关于想想手作',
    content: '想想手作是一款专为拼豆手工爱好者设计的创作工具，帮助你将创意转化为可触摸的艺术作品。\n\n版本：1.0.0',
    showCancel: false
  });
}

function goFeedback() {
  uni.showModal({
    title: '意见反馈',
    content: '如有建议或问题，欢迎发送邮件至 feedback@xiangxiang.app',
    showCancel: false
  });
}

function goPrivacy() {
  uni.showModal({
    title: '隐私政策',
    content: '我们重视您的隐私保护。本应用不会收集您的个人身份信息，所有创作数据仅存储在您的本地设备上，不会上传至任何服务器。',
    showCancel: false
  });
}

function goTerms() {
  uni.showModal({
    title: '用户协议',
    content: '使用本应用即表示您同意：1. 所有创作内容的版权归您所有；2. 本应用提供的色板数据仅供参考；3. 我们有权在必要时更新服务条款。',
    showCancel: false
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
}

.profile-header {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  padding: 48rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 160rpx;
  height: 160rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80rpx;
  border: 6rpx solid rgba(255, 255, 255, 0.5);
}

.edit-avatar {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 48rpx;
  height: 48rpx;
  background: #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  border: 4rpx solid $color-primary;
}

.user-info {
  text-align: center;
}

.username {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 8rpx;
}

.user-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 48rpx;
  background: rgba(255, 255, 255, 0.15);
  padding: 24rpx 48rpx;
  border-radius: $radius-card;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.stat-divider {
  width: 2rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.3);
}

.menu-section {
  margin: 24rpx;
  background: $color-card;
  border-radius: $radius-card;
  overflow: hidden;
  box-shadow: $shadow-card;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 24rpx;
  border-bottom: 2rpx solid $color-border;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background: $color-bg;
  }
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: $color-text;
}

.menu-arrow {
  font-size: 32rpx;
  color: $color-text-weak;
}

.app-info {
  text-align: center;
  padding: 48rpx 24rpx;
}

.app-name {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: $color-text;
  margin-bottom: 8rpx;
}

.app-version {
  display: block;
  font-size: 26rpx;
  color: $color-text-secondary;
  margin-bottom: 8rpx;
}

.app-copyright {
  font-size: 24rpx;
  color: $color-text-weak;
}
</style>
