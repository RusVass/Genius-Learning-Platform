# uploader-image-db

Express-сервер для завантаження зображень на диск або в MongoDB (Buffer) та CRUD для користувачів-зображень.

## Швидкий старт
1. Встанови Node.js 20+ і запусти MongoDB (або кластер Atlas).
2. Створи `.env` у корені:
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster/db
   ```
3. Встанови залежності та стартуй сервер на `http://localhost:3000`:
   ```bash
   npm install
   npm start
   ```

## API (база URL `http://localhost:3000`)
### Завантаження на диск
- `POST /image`
  - form-data, будь-які ключі файлів, до 4 файлів по 5 МБ.
  - Повертає масив `files` з `filename`, `path`, `size`, `mimetype`, `fieldname`.
- `DELETE /image/:filename`
  - Видаляє файл з теки `uploads` за ім’ям з відповіді `POST /image`.

### Завантаження в MongoDB (Buffer)
- `POST /image/db`
  - form-data, ключ `image`, файл ≤5 МБ.
  - Відповідь: `{ id, originalName, mimetype, size, createdAt }`.
- `DELETE /image/db/:id`
  - Видаляє документ з колекції `images` за `_id`.

### Користувачі-зображення
- `POST /imageuser`
  - JSON body: `{ "fullname": "John Doe", "photo": "http://example.com/pic.jpg" }`.
  - `fullname` обов’язкове, зберігається з тримінгом.
- `PUT /imageuser/:id`
  - form-data, ключ `demo_image`, оновлює поле `photo` ім’ям файлу на диску.
  - Повертає оновлений документ або 404.
- `DELETE /imageuser/:id`
  - Видаляє користувача, 204 при успіху, 404 якщо не знайдено.

## Нотатки
- Ліміти розміру: 5 МБ (диск і MongoDB).
- Файли зберігаються у `uploads/`; у репозиторій папка додається порожньою (.gitkeep), самі файли ігноруються.
- Обробка валідації виконується Multer/Mongoose; помилки логуються у консоль.

## Стек
- express
- multer
- mongoose
- dotenv
- body-parser

