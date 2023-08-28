const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const { validationErrors } = require('../middleware/validationErrors')
const { checkAuth } = require('../middleware/checkAuth')
const { createUser, authUser, checkUser, getMoUsers, getMosForUser, updateUserRecord, deleteUser, resetUserPassword } = require('../controllers/users')

// добавить пользователя
router.post(
  '/add-user',
  checkAuth,
  [
    check('name', 'Укажите корректное имя пользователя').not().notEmpty(),
    check('password', 'Укажите пароль пользователя').not().notEmpty().isString(),
    check('idrole', 'Укажите роль пользователя').not().notEmpty().isInt({ min: 1, max: 4 }),
    check('idmu', 'Укажите идентификатор МО').optional({ checkFalsy: true }).notEmpty().isInt(),
    check('phone', 'Укажите номер телефона').optional({ checkFalsy: true }).notEmpty().isString(),
    check('email', 'Укажите email адрес пользователя').optional({ checkFalsy: true }).notEmpty().isEmail()
  ],
  validationErrors,
  createUser
)

// обновить запись пользователя
router.put('/:id', checkAuth, updateUserRecord)

// сбросить пароль пользователя
router.put('/restore/:id', checkAuth, resetUserPassword)

// удалить запись пользователя
router.delete('/:id', checkAuth, deleteUser)

// авторизовать пользователя
router.post(
  '/auth',
  [
    check('username', 'Укажите действующее имя пользователя сервиса').not().notEmpty().isString(),
    check('password', 'Укажите пароль пользователя сервиса').not().notEmpty().isString()
  ],
  validationErrors,
  authUser
)

// получить информацио по пользователю
router.get('/auth', checkAuth, checkUser)

// получить список пользователей
router.get('/', checkAuth, getMoUsers)
// получить список мо для пользователей
router.get('/mos', checkAuth, getMosForUser)

module.exports = router
