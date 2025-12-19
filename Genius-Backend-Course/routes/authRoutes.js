import express from 'express';
import * as authController from '../controllers/authController.js';
import { validateBody } from '../middlewares/validate.js';
import {
    registerSchema,
    loginSchema,
    refreshSchema,
} from '../validators/authSchemas.js';

const router = express.Router();

router.post('/auth/register', validateBody(registerSchema), authController.register);
router.post('/auth/login', validateBody(loginSchema), authController.login);
router.post('/auth/refresh', validateBody(refreshSchema), authController.refresh);
router.post('/auth/logout', validateBody(refreshSchema), authController.logout);

export default router;
