<template>
  <view class="page">
    <NavBar title="搜索" />
    
    <view class="search-header">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input 
          class="search-input" 
          placeholder="搜索作品、用户、标签..." 
          v-model="searchText"
          @confirm="handleSearch"
        />
        <text v-if="searchText" class="clear-icon" @click="clearSearch">✕</text>
      </view>
      <text class="cancel-btn" @click="handleCancel">取消</text>
    </view>

    <scroll-view class="content" scroll-y>
      <view v-if="!searchText" class="search-suggestions">
        <view class="section-title">热门搜索</view>
        <view class="hot-tags">
          <view 
            v-for="tag in hotTags" 
            :key="tag"
            class="hot-tag"
            @click="searchTag(tag)"
          >
            <text>{{ tag }}</text>
          </view>
        </view>

        <view class="section-title">分类浏览</view>
        <view class="category-grid">
          <view 
            v-for="cat in categories" 
            :key="cat.id"
            class="category-item"
            @click="searchCategory(cat.id)"
          >
            <view class="category-icon">{{ cat.icon }}</view>
            <view class="category-name">{{ cat.name }}</view>
          </view>
        </view>
      </view>

      <view v-else class="search-results">
        <view class="results-header">
          <text class="results-count">找到 {{ results.length }} 个结果</text>
        </view>
        
        <view v-if="results.length === 0" class="empty-results">
          <text class="empty-icon">🔍</text>
          <text class="empty-title">未找到相关内容</text>
          <text class="empty-desc">试试其他关键词吧</text>
        </view>
        
        <view v-else class="results-list">
          <view 
            v-for="result in results" 
            :key="result._id"
            class="result-item"
            @click="goDetail(result._id)"
          >
            <view class="result-image">
              <PixelPreview :pattern="result.pattern" compact background="#FFFDF9" />
            </view>
            <view class="result-info">
              <view class="result-title">{{ result.title }}</view>
              <view class="result-author">{{ result.userInfo.nickname }}</view>
              <view class="result-tags">
                <text 
                  v-for="tag in result.tags.slice(0, 3)" 
                  :key="tag"
                  class="result-tag"
                >{{ tag }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import NavBar from '@/components/NavBar.vue';
import PixelPreview from '@/components/PixelPreview.vue';
import { localSearchService, type SearchableItem } from '@/utils/localSearchService';
import { draftStorage, type DraftData } from '@/utils/draftStorage';
import { demoWorks, type PixelPattern } from '@/utils/demoWorks';

const searchText = ref('');

const hotTags = ['猫咪', '风景', '渐变', '文字', '可爱', '节日', '花朵', '礼物'];

const categories = [
  { id: 'cartoon', name: '卡通', icon: '🐱' },
  { id: 'character', name: '人物', icon: '👤' },
  { id: 'landscape', name: '风景', icon: '🌄' },
  { id: 'text', name: '文字', icon: '📝' },
  { id: 'other', name: '其他', icon: '✨' }
];

interface SearchResult {
  _id: string;
  title: string;
  thumbnail: string;
  pattern: PixelPattern;
  userInfo: { nickname: string };
  tags: string[];
}

const results = ref<SearchResult[]>([]);

onMounted(() => {
  localSearchService.refreshIndex();

  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const options = (currentPage as any).$page?.options || {};

  if (options.keyword) {
    searchText.value = decodeURIComponent(options.keyword);
    handleSearch();
  } else if (options.category) {
    searchCategory(options.category);
  }
});

function handleSearch() {
  if (!searchText.value.trim()) {
    results.value = [];
    return;
  }

  localSearchService.refreshIndex();
  const items = localSearchService.search(searchText.value);
  results.value = items.map(toSearchResult);
}

function clearSearch() {
  searchText.value = '';
  results.value = [];
}

function handleCancel() {
  uni.navigateBack();
}

function searchTag(tag: string) {
  searchText.value = tag;
  localSearchService.refreshIndex();
  const items = localSearchService.searchByTag(tag);
  results.value = items.map(toSearchResult);
}

function searchCategory(id: string) {
  localSearchService.refreshIndex();
  const items = localSearchService.searchByCategory(id);
  results.value = items.map(toSearchResult);
  searchText.value = categories.find(c => c.id === id)?.name || '';
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/work-detail/index?id=${id}` });
}

function toSearchResult(item: SearchableItem): SearchResult {
  if (item.source === 'demo') {
    const work = item.originalData as typeof demoWorks[0];
    return {
      _id: work._id,
      title: work.title,
      thumbnail: '',
      pattern: work.pattern,
      userInfo: work.userInfo,
      tags: work.tags
    };
  }
  const draft = item.originalData as DraftData;
  return {
    _id: draft._id,
    title: draft.title,
    thumbnail: '',
    pattern: draft.pixels,
    userInfo: { nickname: '我' },
    tags: []
  };
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $color-bg;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  background: $color-card;
  border-bottom: 2rpx solid $color-border;
}

.search-input-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  background: $color-bg;
  border-radius: $radius-button;
  padding: 0 20rpx;
  height: 72rpx;
}

.search-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
}

.clear-icon {
  font-size: 24rpx;
  color: $color-text-weak;
  padding: 8rpx;
}

.cancel-btn {
  font-size: 28rpx;
  color: $color-text-secondary;
}

.content {
  height: calc(100vh - 184rpx);
  padding: 24rpx;
}

.search-suggestions {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $color-text;
  margin-bottom: 16rpx;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.hot-tag {
  padding: 16rpx 28rpx;
  background: $color-card;
  border-radius: $radius-button;
  font-size: 26rpx;
  color: $color-text-secondary;
  box-shadow: $shadow-card;
  
  &:active {
    background: $color-primary-light;
    color: $color-primary;
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16rpx;
}

.category-item {
  background: $color-card;
  border-radius: $radius-card;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  box-shadow: $shadow-card;
  
  &:active {
    transform: scale(0.98);
  }
}

.category-icon {
  font-size: 48rpx;
}

.category-name {
  font-size: 24rpx;
  color: $color-text-secondary;
}

.search-results {
  display: flex;
  flex-direction: column;
}

.results-header {
  margin-bottom: 20rpx;
}

.results-count {
  font-size: 26rpx;
  color: $color-text-secondary;
}

.empty-results {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.result-item {
  display: flex;
  background: $color-card;
  border-radius: $radius-card;
  overflow: hidden;
  box-shadow: $shadow-card;
  
  &:active {
    transform: scale(0.98);
  }
}

.result-image {
  width: 160rpx;
  height: 160rpx;
}

.result-info {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.result-title {
  font-size: 28rpx;
  font-weight: 500;
  color: $color-text;
}

.result-author {
  font-size: 24rpx;
  color: $color-text-secondary;
}

.result-tags {
  display: flex;
  gap: 12rpx;
  margin-top: auto;
}

.result-tag {
  padding: 6rpx 12rpx;
  background: $color-bg;
  border-radius: 8rpx;
  font-size: 22rpx;
  color: $color-text-weak;
}
</style>
