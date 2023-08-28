const express = require('express')
const router = express.Router()
const version = require('../package.json').version

// маршруты api
router.use('/users', require('./users'))
router.get('/health', async (req, res) => {
  res.status(200).json({ success: true, version, msg: 'Сервис работает стабильно' })
})

// 404
router.use('*', async (req, res) => {
  res.status(404).json({ success: false, msg: 'Маршрут не найден' })
})

module.exports = router
