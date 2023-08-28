require('dotenv').config()
const path = require('path')

const filesPath = process.env.ENV === 'production' ? path.resolve('frontend', 'build', 'images') : path.resolve('frontend', 'public', 'images')

module.exports = { filesPath }
