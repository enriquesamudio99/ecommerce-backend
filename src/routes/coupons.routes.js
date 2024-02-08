import { Router } from 'express';
import { 
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/coupon.controller.js';
import { verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyTokenAndAdmin, getCoupons);
router.get('/:id', verifyTokenAndAdmin, getCoupon);
router.post('/', verifyTokenAndAdmin, createCoupon);
router.patch('/:id', verifyTokenAndAdmin, updateCoupon);
router.delete('/:id', verifyTokenAndAdmin, deleteCoupon);

export default router;