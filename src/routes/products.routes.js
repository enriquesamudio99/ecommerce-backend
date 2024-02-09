import { Router } from 'express';
import { 
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  rateProduct,
  removeRateFromProduct
} from '../controllers/product.controller.js';
import upload from '../config/multer.js';
import { verifyToken, verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post(
  '/', 
  upload.array('image'),
  verifyTokenAndAdmin, 
  createProduct
);
router.patch('/:id', verifyTokenAndAdmin, updateProduct);
router.delete('/:id', verifyTokenAndAdmin, deleteProduct);
router.patch('/:id/rate', verifyToken, rateProduct);
router.patch('/:id/remove-rate', verifyToken, removeRateFromProduct);

export default router;