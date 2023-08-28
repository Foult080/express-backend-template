require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { addUser, getUser, getUsers, getMos, updateUser, deleteUserById, getUserById } = require('../services/users')
const { handleError, BadRequest, Forbidden, NotFound } = require('../utils/errorsHandler')
const { generatePassword, sendEmailToUser } = require('../utils/utils')

/**
 * Добавить пользователя системы
 */
const createUser = async (req, res, next) => {
  try {
    // проверка прав пользователя
    const userCred = req.user
    if (userCred?.idrole !== 1) throw Forbidden('У пользователя нет прав на создание записи')
    const { name, password, idrole, idmu = null, phone, email } = req.body
    const user = await getUser(name)
    if (user) throw BadRequest('Пользователь уже был зарегистрирован')

    const salt = await bcrypt.genSalt(10)
    const pass = await bcrypt.hash(password, salt)

    await addUser({ name, pass, idrole, idmu, phone, email })
    const data = await getUsers()
    return res.status(201).json({ status: 'success', data })
  } catch (error) {
    return handleError(error, next)
  }
}

// Обновить запись пользователя
const updateUserRecord = async (req, res, next) => {
  try {
    const { idrole: userRole } = req.user
    if (userRole !== 1) throw new Forbidden('Недостаточно прав')
    const iduser = req.params.id

    const { name, password, idrole, idmu, email, phone } = req.body
    const userObject = { name: name || null, idrole: idrole || null, idmu: idmu || null, email: email || null, phone: phone || null }
    if (password) {
      const salt = await bcrypt.genSalt(10)
      userObject.pass = await bcrypt.hash(password, salt)
    }
    await updateUser(iduser, userObject)
    const data = await getUsers()
    return res.status(200).json({ status: 'success', data })
  } catch (error) {
    return handleError(error, next)
  }
}

// Сбросить пароль пользователя и отправить его на почту
const resetUserPassword = async (req, res, next) => {
  try {
    // проверка прав пользователя
    const { idrole: userRole } = req.user
    if (userRole !== 1) throw Forbidden('Недостаточно прав')

    // получаем id пользователя
    const iduser = req.params.id

    // проверяем существование пользователя
    const user = await getUserById(iduser)
    if (!user) throw NotFound('Запись с таким идентификатором не найдена')

    // проверим наличием email адреса
    const { email = null } = user
    if (!email) throw Forbidden('Действие запрещено! У пользователя отсутсвует email адрес.')

    // формируем и сохраняем новый пароль
    const password = generatePassword()
    const salt = await bcrypt.genSalt(10)
    const pass = await bcrypt.hash(password, salt)

    await updateUser(iduser, { pass })

    const msg = `<div><p>Здравствуйте!</p><p>Вам был сформирован новый пароль для доступа к сервису FPgram:</p><b>${password}</b><p>Если вы не запрашивали новый пароль, то свяжитесь с отделом ТМК.</p><p>Данное письмо автоматически сформировано. Просьба не отвечать на него.</p></div>`
    await sendEmailToUser(email, 'Новый пароль для FPgram', msg)
    return res.status(200).json({ status: 'success', msg: 'Пароль для пользователя успешно сброшен' })
  } catch (error) {
    return handleError(error, next)
  }
}

/**
 * Авторизовать пользователя в сервисе
 */
const authUser = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await getUser(username)
    if (!user) return res.status(400).json({ status: 'error', msg: 'Ошибка авторизации', errors: [{ msg: 'Пользователь не найден в системе' }] })

    const isMatch = await bcrypt.compare(password, user.pass)
    if (!isMatch) return res.status(400).json({ status: 'error', msg: 'Ошибка авторизации', errors: [{ msg: 'Неверный пароль пользователя' }] })

    delete user.pass
    const payload = { user }
    const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE })

    return res.status(200).json({ authToken, user })
  } catch (error) {
    return handleError(error, next)
  }
}

/**
 * Если ликвидный токен, то отдаём информацию о токене
 */
const checkUser = async (req, res, next) => {
  try {
    const { user } = req
    const userInfo = await getUser(user.name)
    delete userInfo.pass
    return res.status(200).json({ user: userInfo })
  } catch (error) {
    return handleError(error, next)
  }
}

// получить список пользователей системы
const getMoUsers = async (req, res, next) => {
  try {
    const { idrole } = req.user
    if (idrole !== 1) throw new Forbidden('Недостаточно прав')
    const data = await getUsers()
    return res.status(200).json({ status: 'success', data })
  } catch (error) {
    handleError(error, next)
  }
}

// получить мо для пользователей
const getMosForUser = async (req, res, next) => {
  try {
    const { idrole } = req.user
    if (idrole !== 1) throw new Forbidden('Недостаточно прав')
    const data = await getMos()
    return res.status(200).json({ status: 'success', data })
  } catch (error) {
    handleError(error, next)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { idrole } = req.user
    if (idrole !== 1) throw new Forbidden('Недостаточно прав')
    const iduser = req.params.id
    await deleteUserById(iduser)
    const data = await getUsers()
    return res.status(200).json({ status: 'success', data })
  } catch (error) {
    handleError(error, next)
  }
}

module.exports = { createUser, authUser, checkUser, getMoUsers, getMosForUser, updateUserRecord, deleteUser, resetUserPassword }
