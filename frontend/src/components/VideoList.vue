<template>
  <div class="video-list">
    <div v-if="videos.length === 0 && !loading" class="empty-state">
      <p v-if="hasSearched">暂无搜索结果</p>
      <p v-else>输入关键词开始搜索B站视频</p>
    </div>

    <div class="videos-grid">
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
          <span class="duration">{{ formatDuration(video.duration) }}</span>
        </div>
        <div class="video-info">
          <h3 class="title" v-html="highlightKeyword(video.title)"></h3>
          <div class="meta">
            <span class="author">
              <svg class="icon" viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {{ video.author }}
            </span>
            <span class="plays">
              <svg class="icon" viewBox="0 0 24 24" width="14" height="14">
                <path fill="currentColor" d="M8 5v14l11-7z"/>
              </svg>
              {{ formatNumber(video.play) }}
            </span>
          </div>
          <p class="description" v-html="highlightKeyword(video.description)"></p>
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
  max-width: 1200px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  font-size: 16px;
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

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

.cover-wrapper {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
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

.duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.video-info {
  padding: 14px;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: #18191c;
  line-height: 1.4;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.title :deep(mark) {
  background: #fb7299;
  color: white;
  padding: 0 2px;
  border-radius: 2px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.meta span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #9499a0;
}

.icon {
  opacity: 0.7;
}

.description {
  font-size: 12px;
  color: #9499a0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description :deep(mark) {
  background: #fb7299;
  color: white;
  padding: 0 2px;
  border-radius: 2px;
}
</style>
