require('dotenv').config()
const jwt = require('jsonwebtoken')
const { handleError, Unauthorized, Forbidden } = require('../utils/errorsHandler')

/**
 * Проверить токен пользователя и Content type
 */
const checkAuth = async (req, res, next) => {
  const token = req.header('authToken')
  try {
    if (!token) throw Unauthorized('Нет токена, авторизация отклонена')
    const { user } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (err) {
    let error
    // проверяем что за ошибка
    switch (err.name) {
      case 'JsonWebTokenError': {
        error = Unauthorized('Не корректный токен. Повторно авторизуйтесь в системе.')
        break
      }
      case 'TokenExpiredError': {
        error = Unauthorized('Срок жизни вашего токена истёк. Повторно авторизуйтесь в системе.')
        break
      }
      default:
        error = err
    }
    // передаем ошибку дальше
    return handleError(error, next)
  }
}

/**
 * Проверка прав администратора
 */
const checkAdmin = (req, res, next) => {
  const { user } = req
  const { idrole } = user
  try {
    if (idrole !== 1) throw Forbidden('Недостаточно прав')
    return next()
  } catch (error) {
    handleError(error, next)
  }
}

module.exports = { checkAuth, checkAdmin }
