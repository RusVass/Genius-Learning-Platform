# Express Tasks API

Невеликий демо-сервер на Express для керування списком задач у пам’яті (CRUD).

## Що є в проекті
- Express + body-parser для обробки JSON та `application/x-www-form-urlencoded`.
- Масив `tasks` із початковими 5 задачами та автоінкрементом `id`.
- CRUD-роути для задач: перегляд, створення, оновлення, видалення.
- Два варіанти видачі всіх задач: простий `/tasks` (масив) та `/api/tasks` (у форматі `{ data }`).

## Запуск
1) Встановити залежності:
```
npm install
```
2) Запустити сервер:
```
npm run start
```
Слухає на `http://localhost:3000` (можна задати порт через `PORT`).

## Роути
- `GET /tasks` — повертає масив задач.
- `GET /api/tasks` — повертає `{ data: tasks }`.
- `GET /api/tasks/:id` — задача за `id`.
- `POST /api/tasks` — створити задачу. Тіло: `{ "text": "New task" }`.
- `PUT /api/tasks/:id` — оновити текст. Тіло: `{ "text": "Updated" }`.
- `DELETE /api/tasks/:id` — видалити задачу.

## Як перевірити в Postman
1) **GET усі**:  
   - Метод: `GET`  
   - URL: `http://localhost:3000/api/tasks`

2) **GET за id**:  
   - Метод: `GET`  
   - URL: `http://localhost:3000/api/tasks/1`

3) **POST створити**:  
   - Метод: `POST`  
   - URL: `http://localhost:3000/api/tasks`  
   - Body → `raw` → `JSON`:  
   ```json
   { "text": "Buy milk" }
   ```

4) **PUT оновити**:  
   - Метод: `PUT`  
   - URL: `http://localhost:3000/api/tasks/1`  
   - Body → `raw` → `JSON`:  
   ```json
   { "text": "Buy milk and bread" }
   ```

5) **DELETE видалити**:  
   - Метод: `DELETE`  
   - URL: `http://localhost:3000/api/tasks/1`

## Нотатки
- Дані зберігаються в оперативній пам’яті та зникнуть після рестарту.
- Для форм-даних можна використовувати `x-www-form-urlencoded` (працює через body-parser).

