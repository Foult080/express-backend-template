require('dotenv').config()
const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const { errorHandler } = require('./middleware/errorMiddleware')
const path = require('path')

app.use(express.json({ extended: false }))

// middleware для загрузки файлов
app.use(fileUpload({ createParentPath: true, useTempFiles: false }))

// маршруты api
const router = require('./routes/index')
app.use('/api/', router)
// добавляем статичную директорию с билдом фронта
app.use(express.static(path.join(__dirname, 'frontend', 'build')))

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.info(`Server is running on ${PORT}`))

// для тестов в mocha
module.exports = app
