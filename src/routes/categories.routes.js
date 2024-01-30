import { Router } from 'express';
import { getCategories, getCategory, createCategory } from '../controllers/category.controller.js';
import { verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', verifyTokenAndAdmin, createCategory); 

export default router;