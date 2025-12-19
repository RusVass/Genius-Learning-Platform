# Простий HTTP-сервер (Node ESM)

## Огляд
- Легкий HTTP-сервер на `http` (ESM) без залежностей.
- Слухає `http://127.0.0.1:7000`.
- Маршрути:
  - `GET /home` → `Home page`
  - `GET /about` → `About page`
  - `GET /api/admin` → `Read admin resource`
  - `POST /api/admin` → `Create admin resource` (201)
  - `POST /about` → `About page`
  - `PUT /api/admin` → `Update admin resource`
  - `PATCH /api/admin` → `Patch admin resource`
  - `DELETE /api/admin` → `Delete admin resource`
  - Інші шляхи → 404 `Not Found`

## Передумови
- Node.js 18+ (ESM, вбудований `fetch` використовується у `post-check.js`).

## Команди
- Запуск сервера: `npm start`
- Повна перевірка усіх маршрутів (GET/POST/PUT/PATCH/DELETE): `bash check.sh`  
  (сервер має бути запущений)
- Перевірка лише POST маршрутів через fetch: `node post-check.js`  
  (сервер має бути запущений)

## Postman / Insomnia
- База: `http://127.0.0.1:7000`
- Створи запити:
  - GET `/home`
  - GET `/about`
  - GET `/api/admin`
  - POST `/api/admin`
  - POST `/about`
  - PUT `/api/admin`
  - PATCH `/api/admin`
  - DELETE `/api/admin`
- Готова колекція: `postman_collection.json`. Імпорт: Postman → Import → File → вибери колекцію. Змінна `baseUrl` уже налаштована на `http://127.0.0.1:7000`. У Runner можна прогнати всі запити послідовно.
- Збережи як колекцію — тоді можна запускати послідовно через Runner.

## Швидкі ручні перевірки (curl)
```bash
curl -i http://127.0.0.1:7000/home
curl -i http://127.0.0.1:7000/about
curl -i -X POST http://127.0.0.1:7000/api/admin
curl -i -X PUT http://127.0.0.1:7000/api/admin
curl -i -X PATCH http://127.0.0.1:7000/api/admin
curl -i -X DELETE http://127.0.0.1:7000/api/admin
```

## Вирішення конфлікту порту
- Якщо бачиш `EADDRINUSE`, перевір процес на порту 7000:  
  `lsof -i :7000 -sTCP:LISTEN`
- Заверши зайвий процес: `kill <pid>` і перезапусти `npm start`.


