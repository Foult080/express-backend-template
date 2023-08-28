/**
 * Парсер объекта, для того чтобы подставить null в пустые значения
 * @param {Object} data - объект
 */
const parseObject = (data) => {
  const result = {}
  Object.keys(data).forEach((item) => {
    const value = data[item]
    if (value || value?.length) {
      result[item] = value
    }
  })
  return result
}

/**
 * Подготовка данных для вставки в базу
 * @param {Object} data - данные для вставки
 * @returns {Object}
 */
const prepareToInsert = (data) => {
  // убираем лишнее из объекта
  const record = parseObject(data)
  // подготовка блока Into
  const into = Object.keys(record).join(', ')
  // подготовка массива значений для вставки
  const params = Object.values(record)
  // формирование массива VALUES ($1,$2..)
  const values = []
  params.forEach((item, index) => {
    index++
    values.push('$' + index)
  })
  return { into, values, params }
}

/**
 * Подтовка объекта к вставке
 * @param {Object} data - объект данных
 * @returns {Object}
 */
const prepareToUpdate = (data) => {
  let fields = []
  const values = Object.values(data)
  Object.keys(data).forEach((el, index) => {
    fields.push(`${el} = $` + (index + 2)) // увеличиваем index на 2 чтобы под 1 элементом был id записи
  })
  fields = fields.join(', ')
  return { fields, values }
}

module.exports = { prepareToInsert, prepareToUpdate }
