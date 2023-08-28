FROM node:18-alpine

#Настройка часового пояса
ENV TZ=Asia/Krasnoyarsk
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Папка приложения
ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# Установка зависимостей
COPY package.json ./
COPY package-lock.json ./
COPY .npmrc ./

# Установка зависимостей
RUN npm ci --production

# Копирование файлов проекта
COPY . ./

# Запуск проекта
CMD ["npm", "start"]