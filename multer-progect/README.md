# Multer GridFS API

API-сервер на Express для завантаження, отримання та видалення зображень у MongoDB GridFS.

## Вимоги
- Node.js 18+ (перевірено на Node 20)
- MongoDB (Atlas або локальний інстанс)

## Налаштування
1) Встановіть залежності:
```bash
npm install
```
2) Створіть `.env` у корені:
```
MONGODB_URI=... # рядок підключення до MongoDB
MONGODB_DB=multer
GRIDFS_BUCKET=uploads
PORT=3001
MAX_FILE_SIZE_MB=5
```
3) Запуск:
```bash
npm start
```

## Основні можливості
- Завантаження лише зображень (`jpeg`, `png`, `webp`, `gif`, `svg`) у GridFS.
- Ліміт розміру файлу: `MAX_FILE_SIZE_MB` (дефолт 5MB).
- Список файлів з пагінацією.
- Отримання файлу з кешуючими заголовками.
- Видалення файлу з GridFS.

## Ендпоінти
Базовий URL: `http://localhost:${PORT}` (за замовчуванням `http://localhost:3001`).

### GET `/`
Health-check.
- Відповідь: `200 { "status": "ok" }`

### POST `/api/images`
Завантаження зображення у GridFS.
- Тіло (multipart/form-data): поле `image` (файл).
- Відповідь `201`:
```json
{
  "id": "<ObjectId>",
  "url": "/api/images/<ObjectId>",
  "originalname": "...",
  "mimetype": "...",
  "size": 1234,
  "bucket": "uploads",
  "db": "multer"
}
```
- Помилки:
  - `400 File is required`
  - `400 Only image files are allowed`
  - `400 File too large. Max <N> MB`
  - `500 Upload failed`

### GET `/api/images`
Список зображень (пагінація, сортування за `uploadDate desc`).
- Query params: `page` (>=1, дефолт 1), `limit` (1..100, дефолт 20).
- Фільтр: filename за regex `.(png|jpe?g|webp|gif|svg)` (чутливість до регістру вимкнена).
- Відповідь `200`:
```json
{
  "page": 1,
  "limit": 20,
  "total": 2,
  "pages": 1,
  "items": [
    {
      "id": "...",
      "filename": "file_...png",
      "size": 1234,
      "uploadDate": "2024-01-01T00:00:00.000Z",
      "url": "/api/images/..."
    }
  ]
}
```

### GET `/api/images/:id`
Отримання файлу з GridFS.
- Заголовки: 
  - `Content-Type`: MIME файлу або `application/octet-stream`
  - `Content-Disposition: inline`
  - `Cache-Control: public, max-age=31536000, immutable`
- Помилки:
  - `400 Invalid id`
  - `404 Not found`
  - `415 Unsupported media type` (якщо в бакеті не зображення)

### DELETE `/api/images/:id`
Видалення файлу з GridFS.
- Відповідь `200`: `{ "ok": true, "id": "<id>" }`
- Помилки:
  - `400 Invalid id`
  - `404 Not found`

## Приклади для Postman / cURL
### Завантаження
```bash
curl -i -X POST http://localhost:3001/api/images \
  -F "image=@/path/to/image.jpg"
```

### Список
```bash
curl -i "http://localhost:3001/api/images?page=1&limit=20"
```

### Отримання
```bash
curl -i http://localhost:3001/api/images/<id>
```

### Видалення
```bash
curl -i -X DELETE http://localhost:3001/api/images/<id>
```

## Примітки
- `.env` вже у `.gitignore` — не комітьте секрети.
- Якщо змінюєте `.env`, перезапустіть `npm start`.
- Доступні типи зображень налаштовані в `config/db.js` (`allowedImageMimeTypes`).

