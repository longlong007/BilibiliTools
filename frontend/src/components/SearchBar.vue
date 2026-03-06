<template>
  <div class="search-bar">
    <div class="search-container">
      <input
        v-model="keyword"
        type="text"
        placeholder="输入搜索关键词..."
        @keyup.enter="handleSearch"
      />
      <select v-model="order">
        <option value="click">播放量</option>
        <option value="update">更新时间</option>
        <option value="dm">弹幕数</option>
      </select>
      <button @click="handleSearch" :disabled="loading">
        {{ loading ? '搜索中...' : '搜索' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  loading: Boolean
})

const emit = defineEmits(['search'])

const keyword = ref('')
const order = ref('click')

const handleSearch = () => {
  if (keyword.value.trim() && !props.loading) {
    emit('search', keyword.value.trim(), order.value)
  }
}
</script>

<style scoped>
.search-bar {
  background: linear-gradient(135deg, #00a1d6 0%, #00c8d4 100%);
  padding: 40px 20px;
}

.search-container {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

input:focus {
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.2);
}

select {
  padding: 14px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  outline: none;
}

button {
  padding: 14px 32px;
  background: #fb7299;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  background: #fc8bab;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(251, 121, 153, 0.4);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
