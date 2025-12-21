# Genius Lessons — бекенд-курс (колекція проєктів)

Колекція навчальних прикладів для поступового занурення в Node.js та бекенд:
- базовий HTTP-сервер без фреймворків
- Express CRUD у памʼяті
- Express + SQLite із персистенцією
- Повноцінний Task Manager на Express + MongoDB з JWT, ролями, Swagger і безпекою

## Структура репозиторію
- `Node-project/` — мінімальний HTTP-сервер на `http` (ESM), маршрути GET/POST/PUT/PATCH/DELETE, готові скрипти перевірки (`check.sh`, `post-check.js`) і Postman-колекція.
- `Exspress-project/` — простий Express CRUD для задач у памʼяті; два формати видачі (`/tasks`, `/api/tasks`), базові маршрути створення/оновлення/видалення.
- `SQLite-project/` — Express + SQLite (`tasks.db`), автоматичне створення таблиці й сидінг 5 задач; приклад SQL-схеми та cURL-запитів.
- `Auth-Project/` — Express + MongoDB з реєстрацією/логіном, JWT (Bearer), Basic Auth, guard-и `checkAuth`, `checkAdmin`, `requireRole`, маршрути `/profile`, `/admin`, `/admin/users`.
- `File-uploader-db/` — приклади роботи з файловою системою Node.js (`fs`, `fs/promises`): читання/запис/append, створення/перейменування/видалення файлів, простий HTTP-сервер, що віддає вміст файлу.
- `MongoDB-project/` — Task Manager API на Express + MongoDB (Mongoose), JWT (access+refresh), ролі `user`/`admin`, Zod-валідатори, Swagger UI, pino-логи, middleware безпеки (helmet, rate limit, cors, compression).

## Як запустити швидко
```bash
git clone git@github.com:RusVass/Genius-Learning-Platform.git
cd Genius-Lessons
```
- Обери підпапку та виконай `npm install`.
- Для простих демо (`Node-project`, `Exspress-project`, `SQLite-project`) достатньо `npm run start` (за потреби `PORT` або `127.0.0.1:7000` для Node-прикладу).
- Для Mongo проєктів створіть `.env` з `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT` (див. приклади в README кожної папки), далі `npm run dev` або `npm run start`.
- Для `Auth-Project` мінімально потрібні `MONGODB_URI`, `JWT_SECRET`, `PORT`; маршрути та формати запитів описані в його README.

## Що ви навчитесь
- Рівень 1: розуміння HTTP-обробки без фреймворків (роутинг, статуси, методи).
- Рівень 2: базовий REST на Express із валідацією даних у тілі запитів.
- Рівень 3: робота з SQLite, міграції/сидінг, CRUD з персистенцією.
- Рівень 4: продакшн-патерни для Express + MongoDB: JWT (access/refresh), ролі, middleware безпеки, Swagger, централізовані помилки, логування.

## Корисні підказки
- Кожен проєкт має свій `README` з маршрутами, прикладами cURL/Postman і вимогами.
- `.env.example` є для конфігурації; не коміть реальні секрети.
- `node_modules/` не включено; ставте залежності окремо в кожній папці.

## Ліцензія
Освітнє використання. Для продакшн — адаптуйте під власні вимоги та безпеку.
