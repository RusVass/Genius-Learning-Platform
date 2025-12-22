function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.name === 'MulterError') {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.message === 'Only image files are allowed') {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.status) {
    res.status(err.status).json({ error: err.message || 'Error' });
    return;
  }

  if (err.message && err.message.includes('MONGODB_URI')) {
    res.status(500).json({ error: 'MONGODB_URI is not configured' });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { errorHandler };

