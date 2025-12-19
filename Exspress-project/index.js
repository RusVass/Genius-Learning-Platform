
const express = require('express');
const bodyParser = require('body-parser');


const app = express();

const port = process.env.PORT || 3000;



// Парсинг JSON та urlencoded тіл запитів
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Статичні демо-дані з унікальними id
const tasks = [
  { id: 1, text: 'Go to shop' },
  { id: 2, text: 'Read a book' },
  { id: 3, text: 'Finish homework' },
  { id: 4, text: 'Practice coding' },
  { id: 5, text: 'Call a friend' },
];
// Лічильник для нових id
let nextId = 6;

// Кореневий маршрут: просте привітання
app.get('/', (_req, res) => {
  res.send('Привіт, Express!');
});

// Отримати всі задачі (простий масив без обгортки)
app.get('/tasks', (_req, res) => {
  res.status(200).json(tasks);
});

// Отримати всі задачі (у форматі { data })
app.get('/api/tasks', (_req, res) => {
  res.json({ data: tasks });
});

// Отримати задачу за id
app.get('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Запис не знайдено' });
  }

  res.status(200).json({ data: task });
});

// Створити нову задачу
app.post('/api/tasks', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Поле text є обовʼязковим' });
  }

  const task = { id: nextId++, text };
  tasks.push(task);

  res.status(201).json({ data: task });
});

// Оновити задачу за id
app.put('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { text } = req.body;
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ message: 'Запис не знайдено' });
  }

  if (!text) {
    return res.status(400).json({ message: 'Немає даних для оновлення' });
  }

  task.text = text;

  res.status(200).json({ data: task });
});

// Видалити задачу за id
app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Запис не знайдено' });
  }

  tasks.splice(index, 1);

  res.status(204).end();
});

// Старт сервера
app.listen(port, () => {
  console.log(`Сервер запущено на http://localhost:${port}`);
});
