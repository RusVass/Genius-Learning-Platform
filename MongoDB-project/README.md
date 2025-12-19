# ✅ Task Manager API

REST API на Express + MongoDB з JWT (access + refresh), ролями `user` / `admin`, валідацією Zod, логами pino та Swagger UI.

## 🚀 Стек
- Node.js / Express
- MongoDB + Mongoose
- JWT (access + refresh)
- Zod (валідація)
- Pino / pino-http (логи)
- Swagger UI
- Helmet, CORS, rate limit, compression

## ✅ Вимоги
- Node.js 20+
- Доступний MongoDB (`MONGODB_URI`)
- NPM

## ⚙️ Швидкий старт
1. Встановити залежності  
   ```bash
   npm install
   ```
2. Створити `.env` (приклад)  
   ```env
   MONGODB_URI="your-mongodb-uri"
   PORT=3001
   JWT_SECRET="your-access-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   JWT_REFRESH_EXPIRES="7d"
   CORS_ORIGINS="http://localhost:3000"
   LOG_LEVEL="info"
   ```
3. Запуск у дев-режимі  
   ```bash
   npm run dev
   ```
   Прод: `npm run start`

Сервер: http://localhost:3001

## 🔐 Авторизація та токени
- Access токен: живе 15 хв (`JWT_SECRET`)
- Refresh токен: за замовчуванням 7 днів (`JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES`)
- Усі захищені запити: `Authorization: Bearer <accessToken>`

### Реєстрація
`POST /api/auth/register`
```json
{ "username": "vasya", "email": "vasya@example.com", "password": "strongPassword123" }
```
Відповідь: `accessToken`, `refreshToken`, `user`.

### Логін
`POST /api/auth/login`
```json
{ "email": "vasya@example.com", "password": "strongPassword123" }
```
Відповідь: `accessToken`, `refreshToken`, `user`.

### Оновити пару токенів
`POST /api/auth/refresh`
```json
{ "refreshToken": "<refresh>" }
```
Відповідь: нові `accessToken`, `refreshToken`. Старий refresh анульовано.

### Логаут
`POST /api/auth/logout`
```json
{ "refreshToken": "<refresh>" }
```
Refresh видаляється з бази.

## 👥 Ролі
| Роль | Права |
| --- | --- |
| user | Працює лише зі своїми задачами |
| admin | Свої задачі + бачить усі задачі |

Реєстрація завжди створює `user`. `admin` задається вручну в БД.

## ✅ Tasks API (потрібен access токен)
- `POST /api/task` — створити задачу (Zod валідація `description`)
- `GET /api/task/my` — список задач поточного юзера
- `GET /api/task/:id` — отримати свою задачу
- `PUT /api/task/:id` — оновити свою задачу (Zod: `description?`, `completed?`)
- `DELETE /api/task/:id` — видалити свою задачу
- `GET /api/task` — всі задачі (лише admin)

## 📘 Swagger UI
`GET /api/docs`  
Натисни Authorize → встав `Bearer <accessToken>` для тесту захищених ендпоінтів. Додано глобальний `bearerAuth` і схема `ErrorResponse`.

## 🛡️ Безпека та middleware
- `helmet`, `cors` (CORS_ORIGINS або `*`), `express-rate-limit` (100 req / 15 хв), `compression`
- Body size ліміт 1mb
- Централізований error handler + 404
- Healthcheck: `GET /health`

## 🪵 Логи
- pino/pino-http, у dev вивід prettified (pino-pretty). Ігнорує авто-лог для `/health`.
- Змінити рівень: `LOG_LEVEL=debug|info|warn|error`.

## 🛠 Команди
```bash
npm run dev    # дев-режим з nodemon
npm run start  # прод-режим
npm test       # (заглушка)
```

## 🌱 Нотатки
- Обовʼязкові env: `MONGODB_URI`, `JWT_SECRET`. Рекомендовано: `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES`, `CORS_ORIGINS`, `LOG_LEVEL`, `PORT`.
- Refresh токени зберігаються в колекції `tokens`, ротується при /refresh.
- Всі задачі звʼязані з користувачем через `createBy`. Admin бачить усі задачі. Валідація тіла через Zod.***