import { Router } from 'express';
import { 
  getInquiries,
  getInquiry,
  createInquiry, 
  updateInquiry,
  updateInquiryStatus,
  deleteInquiry
} from '../controllers/inquiry.controller.js';
import { verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyTokenAndAdmin, getInquiries);
router.get('/:id', verifyTokenAndAdmin, getInquiry);
router.post('/', verifyTokenAndAdmin, createInquiry); 
router.patch('/:id', verifyTokenAndAdmin, updateInquiry);
router.patch('/:id/update-status', verifyTokenAndAdmin, updateInquiryStatus);
router.delete('/:id', verifyTokenAndAdmin, deleteInquiry);

export default router;