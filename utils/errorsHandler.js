/**
 * Класс для работы с ошибками
 */

class ErrorHandler extends Error {
  /**
   * Внутренняя ошибка сервера
   * @returns {Object} error
   */
  InternalError (message) {
    this.status = 500
    this.msg = 'Ошибка работы сервиса'
    this.errors = [{ msg: message }]
    return this
  }

  /**
   * Объект не найден
   * @returns {Object} error
   */
  NotFound (message) {
    this.status = 404
    this.msg = 'Объект в системе не найден'
    this.errors = [{ msg: message }]
    return this
  }

  /**
   * Плохой запрос
   * @returns {Array} errors
   */
  BadRequest (errors) {
    this.status = 400
    this.msg = 'В запросе обнаружены ошибки валидации'
    if (Array.isArray(errors)) this.errors = errors
    else this.errors = [{ msg: errors }]
    return this
  }

  /**
   * Пользователь не авторизован в системе
   * @param {String} message - сообщение
   * @returns {Object} error
   */
  Unauthorized (message) {
    this.status = 401
    this.msg = 'Пользователь не авторизован в системе'
    this.errors = [{ msg: message }]
    return this
  }

  /**
   * Недостаточно прав для выполнения запроса
   * @param {String} message - сообщение
   * @returns {Object} error
   */
  Forbidden (error) {
    this.status = 403
    this.msg = 'Действие запрещено'
    if (typeof error === 'object') this.errors = [error]
    else this.errors = [{ msg: error }]
    return this
  }
}

// Ошибки для обработки
const NotFound = (message) => new ErrorHandler().NotFound(message)
const InternalError = (message) => new ErrorHandler().InternalError(message)
const BadRequest = (errors) => new ErrorHandler().BadRequest(errors)
const Unauthorized = (message) => new ErrorHandler().Unauthorized(message)
const Forbidden = (errors) => new ErrorHandler().Forbidden(errors)

// handler для обработки
const handleError = (error, next) => {
  if (error instanceof ErrorHandler) return next(error)
  return next(InternalError(error.message))
}

module.exports = { handleError, NotFound, InternalError, BadRequest, Unauthorized, Forbidden }
