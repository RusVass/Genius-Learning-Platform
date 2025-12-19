import express from 'express';
import swaggerUI from 'swagger-ui-express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import pino from 'pino';
import pinoHttp from 'pino-http';
import './config/db.js';

dotenv.config();

// Routes
import authRouter from './routes/authRoutes.js';
import taskRouter from './routes/taskRoutes.js';
import swaggerSpec from './config/swagger.js';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport:
        process.env.NODE_ENV === 'development'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
});

const app = express();
const port = Number(process.env.PORT) || 3001;
const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    pinoHttp({
        logger,
        autoLogging: {
            ignorePaths: ['/health'],
        },
    })
);

// security & parsing middleware
app.use(helmet());
app.use(
    cors({
        origin: allowedOrigins.length ? allowedOrigins : '*',
        credentials: true,
    })
);
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(compression());

// healthcheck
app.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));

// docs
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// routes
app.use('/api', authRouter);
app.use('/api', taskRouter);

// 404 handler
app.use((req, res) => {
    req.log.warn({ path: req.path }, 'Route not found');
    res.status(404).json({ message: 'Route not found' });
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    req.log.error({ err }, 'Unhandled error');
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Internal server error' });
});

app.listen(port, () => {
    logger.info(
        `Server listening on port ${port} and starting at http://localhost:${port}`
    );
});
