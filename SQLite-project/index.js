
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const dbName = 'tasks.db';
const port = process.env.PORT || 3000;

// Початкові дані для заповнення таблиці
const seedTasks = [
  'Go to shop',
  'Read a book',
  'Finish homework',
  'Practice coding',
  'Call a friend',
];

function seedDb() {
  db.get('SELECT COUNT(*) AS count FROM tasks', (countErr, row) => {
    if (countErr) {
      console.error('Помилка підрахунку записів:', countErr.message);
      return;
    }

    if ((row?.count ?? 0) > 0) {
      return; // вже є дані, сид не потрібен
    }

    const stmt = db.prepare('INSERT INTO tasks (text) VALUES (?)');

    seedTasks.forEach((text) => {
      stmt.run(text);
    });

    stmt.finalize((finalizeErr) => {
      if (finalizeErr) {
        console.error('Помилка фіналізації сидінгу:', finalizeErr.message);
      } else {
        console.log(`Посіяно ${seedTasks.length} записів у tasks`);
      }
    });
  });
}

// Підключення до SQLite та створення таблиці, якщо її ще немає
const db = new sqlite3.Database(dbName, (err) => {
  if (err) {
    console.error('Помилка підключення до бази даних:', err.message);
    return;
  }

  console.log(`Підключено до бази даних ${dbName}`);

  db.run(
    `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL
    )
  `,
    (createErr) => {
      if (createErr) {
        console.error('Помилка створення таблиці tasks:', createErr.message);
      } else {
        console.log('Таблиця tasks готова до роботи');
        seedDb();
      }
    },
  );
});

// Парсинг JSON та urlencoded тіл запитів
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Кореневий маршрут: просте привітання
app.get('/', (_req, res) => {
  res.send('Привіт, Express!');
});

// Отримати всі задачі (простий масив без обгортки)
app.get('/tasks', (_req, res) => {
  db.all('SELECT id, text FROM tasks ORDER BY id', (err, rows) => {
    if (err) {
      console.error('Помилка читання tasks:', err.message);
      return res.status(500).json({ message: 'Помилка читання з бази' });
    }

    return res.status(200).json(rows);
  });
});

// Отримати всі задачі (у форматі { data })
app.get('/api/tasks', (_req, res) => {
  db.all('SELECT id, text FROM tasks ORDER BY id', (err, rows) => {
    if (err) {
      console.error('Помилка читання tasks:', err.message);
      return res.status(500).json({ message: 'Помилка читання з бази' });
    }

    return res.status(200).json({ data: rows });
  });
});

// Отримати задачу за id
app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  db.get('SELECT id, text FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Помилка читання tasks:', err.message);
      return res.status(500).json({ message: 'Помилка читання з бази' });
    }

    if (!row) {
      return res.status(404).json({ message: 'Запис не знайдено' });
    }

    return res.status(200).json({ data: row });
  });
});

// Створити нову задачу
app.post('/api/tasks', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Поле text є обовʼязковим' });
  }

  db.run(
    'INSERT INTO tasks (text) VALUES (?)',
    [text],
    function handleInsert(err) {
      if (err) {
        console.error('Не вдалося створити задачу:', err.message);
        return res.status(500).json({ message: 'Помилка запису в базу' });
      }

      const task = { id: this.lastID, text };

      return res.status(201).json({ data: task });
    },
  );
});

// Оновити задачу за id
app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Немає даних для оновлення' });
  }

  db.run(
    'UPDATE tasks SET text = ? WHERE id = ?',
    [text, id],
    function handleUpdate(err) {
      if (err) {
        console.error('Не вдалося оновити задачу:', err.message);
        return res.status(500).json({ message: 'Помилка оновлення в базі' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Запис не знайдено' });
      }

      return res.status(200).json({ data: { id, text } });
    },
  );
});

// Видалити задачу за id
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);

  db.run('DELETE FROM tasks WHERE id = ?', [id], function handleDelete(err) {
    if (err) {
      console.error('Не вдалося видалити задачу:', err.message);
      return res.status(500).json({ message: 'Помилка видалення з бази' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: 'Запис не знайдено' });
    }

    return res.status(204).end();
  });
});

// Старт сервера
app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});
