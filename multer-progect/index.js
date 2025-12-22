require('dotenv').config();

const express = require('express');
const { errorHandler } = require('./middleware/error-handler');
const { notFound } = require('./middleware/not-found');
const healthRouter = require('./routes/health');
const imagesRouter = require('./routes/images');

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

app.use('/', healthRouter);
app.use('/api/images', imagesRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

