import { Router } from 'express';
import { 
  uploadProductImages
} from '../controllers/upload.controller.js';
import upload from '../config/multer.js';
import { verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/products/:id', 
  verifyTokenAndAdmin, 
  upload.array('images', 10),
  uploadProductImages
);

export default router;