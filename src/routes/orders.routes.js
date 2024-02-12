import { Router } from 'express';
import { 
  getAllOrders, 
  getMyOrders, 
  getOrdersByUser, 
  createOrder, 
  updateOrderStatus 
} from '../controllers/order.controller.js';
import { verifyToken, verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyTokenAndAdmin, getAllOrders);
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/:id', verifyTokenAndAdmin, getOrdersByUser);
router.post('/', verifyToken, createOrder);
router.post('/:id/update-status', verifyTokenAndAdmin, updateOrderStatus);

export default router;