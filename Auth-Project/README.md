# Auth Project

## Запуск
```bash
npm install
PORT=3001 npm start
```

Потрібні змінні `.env` у корені:
```
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<random_32_byte_secret>
PORT=3001
```

## Маршрути
- `POST /register` — створення користувача (роль фіксовано `user`), видає JWT.
- `POST /login` — логін, видає JWT.
- `GET /profile` — Bearer JWT обовʼязковий.
- `GET /admin` — Bearer JWT + роль `admin`.
- `POST /admin/users` — створення користувача (admin/user), тільки для admin.
- `GET /basic-profile` — Basic Auth (email + пароль), без JWT.

## Формати запитів
### POST /register
Body (JSON):
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "secret123"
}
```
Відповідь 201: дані користувача + `token`.

### POST /admin/users (лише admin)
Headers:
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```
Body (JSON):
```json
{
  "firstName": "Admin2",
  "lastName": "User",
  "email": "admin2@example.com",
  "password": "secret123",
  "role": "admin"  // або "user"
}
```
Відповідь 201: дані створеного користувача (без токена).

### POST /login
Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "secret123"
}
```
Відповідь 200: дані користувача + `token`.

### GET /profile (JWT)
Headers:
```
Authorization: Bearer <token>
```

### GET /admin (JWT + роль admin)
Headers:
```
Authorization: Bearer <token_with_role_admin>
```

### GET /basic-profile (Basic Auth)
Auth: Basic (username = email, password = plaintext)

## Модель користувача
- `firstName`, `lastName`, `email` (унікальний, lowercase, trim)
- `password` (bcrypt хешується pre-save, `select: false`)
- `role` (`user` | `admin`, за замовчуванням `user`)
- `timestamps`

## Безпека
- JWT підпис HS256, експірація 1h, секрет `JWT_SECRET`.
- Паролі зберігаються як bcrypt-хеш.
- Role guard для `/admin` і `/admin/users` (потрібна роль `admin`).


