import { Router } from 'express';
import { loginUser, registerUser, getAllUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken, verifyTokenAndUser } from '../middlewares/auth.js';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/users', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUser);
router.patch('/users/:id', verifyTokenAndUser, updateUser);
router.delete('/users/:id', verifyTokenAndUser, deleteUser);

export default router;