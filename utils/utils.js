/**
 * Набор utility функций для пользователя
 */

require('dotenv').config()
const nodemailer = require('nodemailer')

// Сформировать случайный пароль для пользователя
const generatePassword = () => {
  // размер пароля
  const length = 8
  // символы для доступные для формирования пароля
  const charSet = '#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$&*0123456789abcdefghijklmnopqrstuvwxyz'
  let password = ''

  for (let i = 0, n = charSet.length; i < length; i++) password += charSet.charAt(Math.floor(Math.random() * n))

  return password
}

/**
 * Отправить пароль пользователю
 * @param {String} email
 * @param {String} title
 * @param {String} msg
 */
const sendEmailToUser = async (email, title, msg) => {
  // создаем smtp транспорт
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD
    }
  })

  // отправляет пароль пользователю
  transporter.sendMail({
    from: process.env.MAILER_USER,
    to: email,
    subject: title,
    html: msg
  })
}

module.exports = { generatePassword, sendEmailToUser }
