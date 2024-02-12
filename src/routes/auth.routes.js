import { Router } from 'express';
import { 
  loginUser, 
  registerUser, 
  handleRefreshToken, 
  logoutUser,
  getAllUsers, 
  getUser, 
  updateUser, 
  deleteUser, 
  blockUser, 
  unblockUser,
  updateUserPassword,
  createResetPasswordToken,
  resetUserPassword,
  updateUserAddress
} from '../controllers/user.controller.js';
import { verifyTokenAndUser, verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.post('/login', loginUser); 
router.post('/register', registerUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser);
router.get('/users', verifyTokenAndAdmin, getAllUsers);
router.get('/users/:id', verifyTokenAndAdmin, getUser);
router.patch('/users/:id', verifyTokenAndUser, updateUser);
router.delete('/users/:id', verifyTokenAndUser, deleteUser);
router.patch('/users/block/:id', verifyTokenAndAdmin, blockUser);
router.patch('/users/unblock/:id', verifyTokenAndAdmin, unblockUser);
router.post('/users/update-password/:id', verifyTokenAndUser, updateUserPassword);
router.post('/users/forget-password', createResetPasswordToken);
router.put('/users/forget-password/:token', resetUserPassword);
router.post('/users/update-address/:id', verifyTokenAndUser, updateUserAddress);

export default router;