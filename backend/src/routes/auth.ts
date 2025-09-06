import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { validate } from '@/middleware';

const router = Router();

// Auth routes
router.post('/register', validate(AuthController.registerValidation), AuthController.register);
router.post('/login', validate(AuthController.loginValidation), AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);

export default router;
