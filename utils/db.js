require('dotenv').config()
const { Pool } = require('pg')

const config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432
}
const pool = new Pool(config)

module.exports = {
  query: (text, params) => pool.query(text, params)
}
