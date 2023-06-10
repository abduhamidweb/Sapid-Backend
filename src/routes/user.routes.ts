import { Router } from 'express';
import userContr from '../controllers/user.contr.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

router.post('/', userContr.createUser);
router.get('/', authMiddleware, userContr.getUsers);
router.get('/:id', authMiddleware, userContr.getUserById);
router.put('/:id', authMiddleware, userContr.updateUser);
router.delete('/:id', authMiddleware, userContr.deleteUser);
router.post('/login', userContr.login);
router.post('/forget', userContr.forget);
export default router;
