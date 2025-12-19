# Express + SQLite Tasks API

Невеликий CRUD API на Express з персистенцією у SQLite. Зберігає задачі у файлі `tasks.db`, створює таблицю автоматично й робить первинний сидінг п’яти записів.

## Стек
- Node.js + Express 5
- body-parser для `application/json` та `x-www-form-urlencoded`
- SQLite (`sqlite3`) із файлом БД `tasks.db`

## Структура
- `index.js` — сервер, ініціалізація БД, сидінг і маршрути.
- `SQLite.sql` — приклад SQL-схеми (таблиця `tasks`).
- `tasks.db` — фактична SQLite-база з таблицею `tasks`.
- `package.json` — залежності та скрипти.

## Схема БД
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL
);
```
При старті виконується сидінг, якщо таблиця порожня: `Go to shop`, `Read a book`, `Finish homework`, `Practice coding`, `Call a friend`.

## Вимоги
- Node.js 18+
- npm

## Установка й запуск
```bash
npm install
npm run start          # або npm run dev
# За замовчуванням: http://localhost:3000, можна задати PORT
```

## API
- `GET /tasks` — масив задач `[{ id, text }]`.
- `GET /api/tasks` — те саме у форматі `{ data: [...] }`.
- `GET /api/tasks/:id` — одна задача `{ data: { id, text } }`.
- `POST /api/tasks` — створити; тіло `{ "text": "New task" }`; 201 + `{ data }`.
- `PUT /api/tasks/:id` — оновити текст; тіло `{ "text": "Updated" }`; 200 + `{ data }`.
- `DELETE /api/tasks/:id` — видалити; 204 без тіла.

## Приклади cURL
```bash
# Усі задачі
curl http://localhost:3000/api/tasks

# Створити
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"text":"Buy milk"}'

# Оновити
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"text":"Buy milk and bread"}'

# Видалити
curl -X DELETE http://localhost:3000/api/tasks/1
```

## Нотатки
- Дані зберігаються у `tasks.db`; файл створюється автоматично.
- Валідація: поле `text` є обов’язковим для POST/PUT.
- Обробка помилок повертає коди 400/404/500 із повідомленнями.

