<template>
  <div class="video-list">
    <!-- 加载骨架屏 -->
    <div v-if="loading" class="skeleton-table">
      <div class="skeleton-header"></div>
      <div v-for="n in 10" :key="n" class="skeleton-row">
        <div class="skeleton-cover"></div>
        <div class="skeleton-info">
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

    <!-- 表格列表 -->
    <div v-else class="table-wrapper">
      <table class="video-table">
        <thead>
          <tr>
            <th class="col-cover">封面</th>
            <th class="col-title">标题</th>
            <th class="col-author">UP主</th>
            <th class="col-stats">播放</th>
            <th class="col-stats">弹幕</th>
            <th class="col-stats">点赞</th>
            <th class="col-stats">投币</th>
            <th class="col-duration">时长</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="video in videos"
            :key="video.bvid"
            @click="openVideo(video)"
          >
            <td class="col-cover">
              <div class="cover-cell">
                <img :src="video.pic" :alt="video.title" loading="lazy" />
                <span class="duration">{{ formatDuration(video.duration) }}</span>
              </div>
            </td>
            <td class="col-title">
              <span class="title" v-html="highlightKeyword(video.title)"></span>
            </td>
            <td class="col-author">
              <div class="author-cell">
                <img v-if="video.uface" :src="video.uface" class="avatar" alt="" />
                <span v-html="highlightKeyword(video.author)"></span>
              </div>
            </td>
            <td class="col-stats">{{ formatNumber(video.play) }}</td>
            <td class="col-stats">{{ formatNumber(video.danmaku) }}</td>
            <td class="col-stats">{{ formatNumber(video.like) }}</td>
            <td class="col-stats">{{ formatNumber(video.coins) }}</td>
            <td class="col-duration">{{ formatDuration(video.duration) }}</td>
          </tr>
        </tbody>
      </table>
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
  if (!num) return '-'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

const formatDuration = (duration) => {
  if (!duration) return '-'
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
.skeleton-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.skeleton-header {
  height: 48px;
  background: #f5f5f5;
  border-bottom: 1px solid #e3e5e7;
}

.skeleton-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  gap: 16px;
}

.skeleton-cover {
  width: 120px;
  height: 68px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

.skeleton-info {
  flex: 1;
}

.skeleton-title {
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 8px;
  width: 60%;
}

.skeleton-meta {
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  width: 30%;
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
  background: white;
  border-radius: 8px;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.5;
}

/* 表格容器 */
.table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 表格 */
.video-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.video-table thead {
  background: #f5f5f5;
  position: sticky;
  top: 0;
}

.video-table th {
  padding: 14px 12px;
  text-align: left;
  font-weight: 600;
  color: #9499a0;
  border-bottom: 1px solid #e3e5e7;
  white-space: nowrap;
}

.video-table td {
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
  vertical-align: middle;
}

.video-table tbody tr {
  cursor: pointer;
  transition: background 0.2s ease;
}

.video-table tbody tr:hover {
  background: #f8f9fa;
}

.video-table tbody tr:last-child td {
  border-bottom: none;
}

/* 列宽 */
.col-cover { width: 140px; }
.col-title { min-width: 200px; }
.col-author { width: 160px; }
.col-stats { width: 80px; text-align: center; }
.col-duration { width: 80px; text-align: center; }

/* 封面单元格 */
.cover-cell {
  position: relative;
  width: 120px;
  height: 68px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}

.cover-cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-cell .duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

/* 标题 */
.title {
  color: #18191c;
  line-height: 1.5;
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

/* UP主 */
.author-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9499a0;
}

.author-cell .avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.author-cell :deep(mark) {
  background: #fb7299;
  color: white;
  padding: 0 2px;
  border-radius: 2px;
}

/* 统计数字 */
.col-stats {
  text-align: center;
  color: #9499a0;
  font-variant-numeric: tabular-nums;
}

.col-duration {
  text-align: center;
  color: #9499a0;
}

/* 响应式 */
@media (max-width: 768px) {
  .col-author,
  .col-stats,
  .col-duration {
    display: none;
  }
}
</style>
