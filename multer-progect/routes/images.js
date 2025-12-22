const express = require('express');
const multer = require('multer');
const { allowedImageMimeTypes, getConfig } = require('../config/db');
const {
  deleteImageById,
  getImageStream,
  listImages,
  uploadImage,
} = require('../services/gridfs');

const router = express.Router();
const { fileSizeLimit } = getConfig();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: fileSizeLimit },
  fileFilter: (_req, file, cb) => {
    const ok = allowedImageMimeTypes.includes(file.mimetype);
    if (!ok) return cb(new Error('Only image files are allowed'));
    cb(null, true);
  },
});

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'File is required' });
      return;
    }

    const result = await uploadImage(req.file);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await listImages({
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { file, stream } = await getImageStream(req.params.id);

    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Content-Disposition', 'inline');

    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(404).json({ error: 'Not found' });
      }
    });
    stream.pipe(res);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteImageById(req.params.id);
    res.status(200).json({ ok: true, id: req.params.id });
  } catch (e) {
    next(e);
  }
});

module.exports = router;

