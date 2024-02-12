import { Router } from 'express';
import { getColors, getColor, createColor, updateColor, deleteColor } from '../controllers/color.controller.js';
import { verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', getColors);
router.get('/:id', getColor);
router.post('/', verifyTokenAndAdmin, createColor); 
router.patch('/:id', verifyTokenAndAdmin, updateColor);
router.delete('/:id', verifyTokenAndAdmin, deleteColor);

export default router; 