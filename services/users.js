const db = require('../utils/db')
const { prepareToInsert } = require('../utils/dbUtils')

/**
 * Проверить существование пользователя в базе
 * @param {String} name - имя пользователя системы
 * @returns {Object}
 */
const getUser = async (name) => {
  const user = (await db.query('select u.iduser, u.name, u.pass, u.idrole, u.idmu from fapogram.users u where u.name = $1', [name])).rows[0]
  if (!user) return null
  return user
}

/**
 * Добавить пользователя
 * @param {Object} data - объект информации о пользователе
 * @returns {Integer} iduser
 */
const addUser = async (data) => {
  const { into, values, params } = prepareToInsert(data)
  const sql = `insert into fapogram.users (${into}) values (${values}) returning iduser`
  const iduser = (await db.query(sql, params)).rows[0]
  return iduser
}

// Получить пользователей
const getUsers = async () => {
  const sql = `select u.iduser, u.name, u.idrole, r.roles, u.idmu, m.mu, u.phone, u.email
    from fapogram.users u
    join fapogram.roles r on u.idrole = r.idroles 
    left join fapogram.mu m on u.idmu = m.id
    order by u.name asc`
  const data = (await db.query(sql)).rows
  return data
}

// получить список МО для формы
const getMos = async () => {
  const sql = 'select m.id as value, m.mu as text from fapogram.mu m order by m.mu asc'
  const data = (await db.query(sql)).rows
  return data
}

// обновить запись пользователя
const updateUser = async (iduser, userObject) => {
  const sets = []
  const values = [iduser]
  let count = 2
  Object.keys(userObject).map((item) => {
    if (userObject[item]) {
      sets.push(item + ' = $' + count)
      values.push(userObject[item])
      count++
    }
    return false
  })
  const sql = `update fapogram.users set ${sets.join(',')} where iduser = $1`
  await db.query(sql, values)
}

// удалить пользователя по id
const deleteUserById = async (iduser) => {
  const sql = 'delete from fapogram.users where iduser=$1'
  await db.query(sql, [iduser])
}

// получить запись пользователя по id
const getUserById = async (userId) => {
  const sql = 'select u.iduser, u.name, u.pass, u.idrole, u.email from fapogram.users u where u.iduser = $1'
  const data = (await db.query(sql, [userId])).rows[0] || null
  return data
}

module.exports = { addUser, getUser, getUsers, getMos, updateUser, deleteUserById, getUserById }
