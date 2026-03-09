const express = require('express');
const cors = require('cors');
const axios = require('axios');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Swagger配置
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'B站视频搜索API',
      version: '1.0.0',
      description: 'B站视频搜索后端服务API文档',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: '本地开发服务器'
      }
    ],
    tags: [
      {
        name: '搜索',
        description: '视频搜索相关接口'
      }
    ]
  },
  apis: ['./server.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'B站视频搜索API文档'
}));

// JSON格式的Swagger文档
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

const BILIBILI_API_BASE = 'https://api.bilibili.com/x/web-interface/search/type';

const axiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.bilibili.com',
    'Origin': 'https://www.bilibili.com'
  }
});

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: 搜索B站视频
 *     description: 根据关键词搜索B站视频列表
 *     tags: [搜索]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         description: 搜索关键词
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         description: 页码，默认1
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pagesize
 *         description: 每页数量，默认20
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: order
 *         description: 排序方式
 *         schema:
 *           type: string
 *           enum: [click, update, dm]
 *           default: click
 *         examples:
 *           click:
 *             summary: 播放量排序
 *           update:
 *             summary: 更新时间排序
 *           dm:
 *             summary: 弹幕数排序
 *     responses:
 *       200:
 *         description: 搜索成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: 0
 *                 data:
 *                   type: object
 *                   properties:
 *                     numResults:
 *                       type: integer
 *                     result:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: 参数错误
 *       500:
 *         description: 服务器错误
 */
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

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: 健康检查
 *     description: 检查服务是否正常运行
 *     tags: [搜索]
 *     responses:
 *       200:
 *         description: 服务正常
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`);
  console.log(`Swagger文档: http://localhost:${PORT}/api-docs`);
});
