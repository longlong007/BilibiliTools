import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export const searchVideos = async (keyword, page = 1, pagesize = 20, order = 'click') => {
  const response = await api.get('/search', {
    params: { keyword, page, pagesize, order }
  })
  return response.data
}
