const fs = require('fs/promises')

const dirName = './tmp/'

/**
 * Проверить существование директории для временных файлов
 * @param {String} dir - путь
 * @returns {Boolean}
 */
const checkDir = async (dir) => {
  try {
    await fs.access(dir)
  } catch (error) {
    return await fs.mkdir(dirName)
  }
}

/**
 * Восстановить файл из базы
 * @param {String} fileName - имя файла
 * @param {String} fileContent - содержимое файла
 * @returns {String}
 */
const restoreFile = async (fileName, fileContent) => {
  // проверка существования директории
  await checkDir(dirName)
  // формирую путь до файла
  const filePath = dirName + fileName
  await fs.writeFile(filePath, fileContent)
  return filePath
}

/**
 * Преобразовать файл в строку(php: file_get_contents )
 * @param {File} file - файл для вставки
 */
const readFileIntoString = async (file) => {
  const content = await fs.readFile(file.tempFilePath, { endcoding: 'string' })
  return content
}

module.exports = { restoreFile, readFileIntoString }
