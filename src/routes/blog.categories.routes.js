import { Router } from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/blog.category.controller.js';
import { verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', verifyTokenAndAdmin, createCategory); 
router.patch('/:id', verifyTokenAndAdmin, updateCategory);
router.delete('/:id', verifyTokenAndAdmin, deleteCategory);

export default router;