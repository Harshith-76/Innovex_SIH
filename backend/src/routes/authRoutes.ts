import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/auth/login', login);
router.get('/auth/me', authenticate, me);
router.post('/auth/logout', authenticate, logout);

export default router;
