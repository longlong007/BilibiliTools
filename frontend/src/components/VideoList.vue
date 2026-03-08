<template>
  <div class="video-list">
    <!-- 加载骨架屏 -->
    <div v-if="loading" class="skeleton-grid">
      <div v-for="n in 8" :key="n" class="skeleton-card">
        <div class="skeleton-cover"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-meta"></div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="videos.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" width="64" height="64">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </div>
      <p v-if="hasSearched">暂无搜索结果</p>
      <p v-else>输入关键词开始搜索B站视频</p>
    </div>

    <!-- 视频列表 -->
    <div v-else class="videos-grid">
      <div
        v-for="video in videos"
        :key="video.bvid"
        class="video-card"
        @click="openVideo(video)"
      >
        <div class="cover-wrapper">
          <img
            :src="video.pic"
            :alt="video.title"
            loading="lazy"
          />
          <div class="cover-overlay">
            <span class="duration">
              <svg viewBox="0 0 24 24" width="12" height="12">
                <path fill="currentColor" d="M8 5v14l11-7z"/>
              </svg>
              {{ formatDuration(video.duration) }}
            </span>
          </div>
          <div class="cover-stats">
            <span v-if="video.danmaku">
              <svg viewBox="0 0 24 24" width="12" height="12">
                <path fill="currentColor" d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"/>
              </svg>
              {{ formatNumber(video.danmaku) }}
            </span>
            <span v-if="video.coins">
              <svg viewBox="0 0 24 24" width="12" height="12">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
              </svg>
              {{ formatNumber(video.coins) }}
            </span>
          </div>
        </div>
        <div class="video-info">
          <h3 class="title" v-html="highlightKeyword(video.title)"></h3>
          <div class="author-row">
            <div class="author">
              <img
                v-if="video.uface"
                :src="video.uface"
                class="author-avatar"
                alt=""
              />
              <span v-html="highlightKeyword(video.author)"></span>
            </div>
            <span class="plays">
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M8 5v14l11-7z"/>
              </svg>
              {{ formatNumber(video.play) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  hasSearched: Boolean,
  keyword: String
})

const emit = defineEmits(['play'])

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

const formatDuration = (duration) => {
  if (!duration) return '00:00'
  const parts = duration.split(':')
  if (parts.length === 2) {
    return duration
  }
  if (parts.length === 3) {
    const [h, m, s] = parts
    if (parseInt(h) > 0) {
      return `${h}:${m}:${s}`
    }
    return `${m}:${s}`
  }
  return duration
}

const highlightKeyword = (text) => {
  if (!props.keyword || !text) return text
  const regex = new RegExp(`(${props.keyword})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const openVideo = (video) => {
  emit('play', video)
  window.open(`https://www.bilibili.com/video/${video.bvid}`, '_blank')
}
</script>

<style scoped>
.video-list {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 骨架屏 */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.skeleton-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.skeleton-cover {
  aspect-ratio: 16 / 10;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  padding: 14px;
}

.skeleton-title {
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-meta {
  height: 16px;
  width: 60%;
  background: #f0f0f0;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #9499a0;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.5;
}

/* 视频网格 */
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 视频卡片 */
.video-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.video-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

/* 封面 */
.cover-wrapper {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #f5f5f5;
}

.cover-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.video-card:hover .cover-wrapper img {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .cover-overlay {
  opacity: 1;
}

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.cover-stats {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  gap: 8px;
}

.cover-stats span {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 3px;
}

/* 视频信息 */
.video-info {
  padding: 14px;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: #18191c;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.title :deep(mark) {
  background: #fb7299;
  color: white;
  padding: 0 2px;
  border-radius: 2px;
}

.author-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9499a0;
  overflow: hidden;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author :deep(mark) {
  background: #fb7299;
  color: white;
  padding: 0 2px;
  border-radius: 2px;
}

.plays {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #9499a0;
  white-space: nowrap;
}

.plays svg {
  opacity: 0.7;
}
</style>
