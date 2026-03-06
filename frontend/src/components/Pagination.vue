<template>
  <div class="pagination" v-if="totalPages > 1">
    <button
      class="page-btn prev"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
    >
      上一页
    </button>

    <div class="page-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage, ellipsis: page === '...' }"
        :disabled="page === '...'"
        @click="page !== '...' && goToPage(page)"
      >
        {{ page }}
      </button>
    </div>

    <button
      class="page-btn next"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
    >
      下一页
    </button>

    <div class="page-info">
      <span>共 {{ total }} 条</span>
      <span>{{ currentPage }} / {{ totalPages }} 页</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  total: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['pageChange'])

const visiblePages = computed(() => {
  const pages = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('pageChange', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 30px 20px;
  flex-wrap: wrap;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  min-width: 40px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #e3e5e7;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #18191c;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled):not(.ellipsis) {
  border-color: #00a1d6;
  color: #00a1d6;
}

.page-btn.active {
  background: #00a1d6;
  border-color: #00a1d6;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.ellipsis {
  border: none;
  background: transparent;
  cursor: default;
}

.page-info {
  margin-left: 16px;
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #9499a0;
}
</style>
