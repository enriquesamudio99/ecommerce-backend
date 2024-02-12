import { Router } from 'express';
import {
  getMyCart,
  updateCart,
  emptyCart,
  applyCoupon
} from '../controllers/cart.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/my-cart', verifyToken, getMyCart);
router.post('/', verifyToken, updateCart);
router.get('/empty-cart', verifyToken, emptyCart);
router.post('/apply-coupon', verifyToken, applyCoupon);

export default router;