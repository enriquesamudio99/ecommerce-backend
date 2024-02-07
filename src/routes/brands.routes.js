import { Router } from 'express';
import { getBrands, getBrand, createBrand, updateBrand, deleteBrand } from '../controllers/brand.controller.js';
import { verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', getBrands);
router.get('/:id', getBrand);
router.post('/', verifyTokenAndAdmin, createBrand); 
router.patch('/:id', verifyTokenAndAdmin, updateBrand);
router.delete('/:id', verifyTokenAndAdmin, deleteBrand);

export default router; 