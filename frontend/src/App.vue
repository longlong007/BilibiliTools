<template>
  <div class="app">
    <SearchBar :loading="loading" @search="handleSearch" />

    <main class="main-content">
      <div class="result-header" v-if="hasSearched">
        <span class="result-count">找到 {{ total }} 个结果</span>
      </div>

      <VideoList
        :videos="videos"
        :loading="loading"
        :has-searched="hasSearched"
        :keyword="keyword"
        @play="handlePlay"
      />

      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total="total"
        @page-change="handlePageChange"
      />
    </main>

    <footer class="footer">
      <p>Powered by Bilibili Open API</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchBar from './components/SearchBar.vue'
import VideoList from './components/VideoList.vue'
import Pagination from './components/Pagination.vue'
import { searchVideos } from './api/search.js'

const videos = ref([])
const loading = ref(false)
const hasSearched = ref(false)
const keyword = ref('')
const order = ref('click')
const currentPage = ref(1)
const total = ref(0)
const totalPages = ref(0)
const pagesize = 20

const handleSearch = async (searchKeyword, searchOrder) => {
  keyword.value = searchKeyword
  order.value = searchOrder
  currentPage.value = 1
  await fetchVideos()
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await fetchVideos()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const fetchVideos = async () => {
  if (!keyword.value) return

  loading.value = true
  try {
    const result = await searchVideos(keyword.value, currentPage.value, pagesize, order.value)

    if (result.code === 0 && result.data) {
      videos.value = result.data.result || []
      total.value = result.data.numResults || 0
      totalPages.value = Math.ceil(total.value / pagesize)
      hasSearched.value = true
    } else {
      console.error('搜索失败:', result.message)
      videos.value = []
      total.value = 0
      totalPages.value = 0
    }
  } catch (error) {
    console.error('请求失败:', error)
    videos.value = []
  } finally {
    loading.value = false
  }
}

const handlePlay = (video) => {
  console.log('播放视频:', video.title)
}
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.result-header {
  padding: 16px 20px 0;
}

.result-count {
  font-size: 14px;
  color: #9499a0;
}

.footer {
  background: #f5f5f5;
  padding: 24px;
  text-align: center;
  margin-top: auto;
}

.footer p {
  font-size: 13px;
  color: #9499a0;
}
</style>
