import { Router } from 'express';
import { 
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog
} from '../controllers/blogController.js';
import { verifyTokenAndUser, verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', getBlogs);
router.get('/:id', getBlog);
router.post('/', verifyTokenAndAdmin, createBlog);
router.patch('/:id', verifyTokenAndAdmin, updateBlog);
router.delete('/:id', verifyTokenAndAdmin, deleteBlog);
router.patch('/:id/like', verifyTokenAndUser, likeBlog); 
router.patch('/:id/dislike', verifyTokenAndUser, dislikeBlog);

export default router;