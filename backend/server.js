const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const BILIBILI_API_BASE = 'https://api.bilibili.com/x/web-interface/search/type';

const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.bilibili.com',
    'Origin': 'https://www.bilibili.com'
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const { keyword, page = 1, pagesize = 20, order = 'click' } = req.query;

    if (!keyword) {
      return res.status(400).json({ error: '关键词不能为空' });
    }

    const response = await axiosInstance.get(BILIBILI_API_BASE, {
      params: {
        search_type: 'video',
        keyword,
        page: parseInt(page),
        pagesize: parseInt(pagesize),
        order
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('搜索请求失败:', error.message);
    const status = error.response?.status;
    const message = error.message;
    
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: '请求超时', message: 'B站API响应超时，请稍后重试' });
    }
    
    res.status(500).json({ error: '搜索请求失败', message, status });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`);
});
