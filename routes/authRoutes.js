import { Router } from 'express';
import { login, register, getAllUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router; 