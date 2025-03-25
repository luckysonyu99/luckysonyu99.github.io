const express = require('express');
const router = express.Router();

// 测试路由
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// TODO: 添加更多路由
// router.use('/records', require('./records'));
// router.use('/photos', require('./photos'));

module.exports = router; 