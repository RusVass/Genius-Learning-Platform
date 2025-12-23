const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Image = require('./models/imageModel');
const ImageUser = require('./models/userModel');

require('./config/db');

const app = express();
const port = 3000;
const uploadsDir = path.join(__dirname, 'uploads');

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const mongoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/image', upload.any(), (req, res) => {
  try {
    const files = req.files ?? [];

    if (files.length === 0) {
      return res.status(400).json({ error: 'Файли не надіслано' });
    }

    if (files.length > 4) {
      return res.status(400).json({ error: 'Максимум 4 файли' });
    }

    res.status(201).json({
      files: files.map((file) => ({
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
        fieldname: file.fieldname,
      })),
    });
  } catch (error) {
    // Multer вже віддає 4xx/5xx на помилки валідації; тут лог для інших випадків
    console.error(error);
    res.sendStatus(400);
  }
});

app.delete('/image/:filename', async (req, res) => {
  try {
    const targetPath = path.join(uploadsDir, req.params.filename);

    await fs.promises.unlink(targetPath);

    return res.sendStatus(204);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Файл не знайдено' });
    }
    console.error(error);
    res.status(400).json({ error: 'Не вдалося видалити файл' });
  }
});

app.post('/image/db', mongoUpload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не надіслано' });
    }

    const { buffer, mimetype, originalname, size } = req.file;

    const saved = await Image.create({
      data: buffer,
      mimetype,
      originalName: originalname,
      size,
    });

    return res.status(201).json({
      id: saved._id,
      originalName: saved.originalName,
      mimetype: saved.mimetype,
      size: saved.size,
      createdAt: saved.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete('/image/db/:id', async (req, res) => {
  try {
    const doc = await Image.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: 'Зображення не знайдено' });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Не вдалося видалити зображення' });
  }
});

app.post('/imageuser', async (req, res) => {
  try {
    const { fullname, photo = null } = req.body ?? {};

    if (!fullname) {
      return res.status(400).json({ error: 'fullname is required' });
    }

    const doc = await ImageUser.create({ fullname, photo });
    return res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Не вдалося створити користувача' });
  }
});

app.put('/imageuser/:id', upload.single('demo_image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не надіслано' });
    }

    const doc = await ImageUser.findByIdAndUpdate(
      req.params.id,
      { photo: req.file.filename },
      { new: true },
    );

    if (!doc) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    return res.status(200).json(doc);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Не вдалося оновити користувача' });
  }
});

app.delete('/imageuser/:id', async (req, res) => {
  try {
    const doc = await ImageUser.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Не вдалося видалити користувача' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

