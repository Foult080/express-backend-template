/**
 * Middleware функция для формирования ответов сервиса
 * @param {Object || Array} error - объект/массив ошибок
 */
const errorHandler = async (error, req, res, next) => {
  const { status, msg, errors } = error
  return res.status(status).json({ status: 'error', msg, errors })
}

module.exports = { errorHandler }
