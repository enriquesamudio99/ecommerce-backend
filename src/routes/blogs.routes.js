import { Router } from 'express';
import { 
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog
} from '../controllers/blog.controller.js';
import { verifyToken, verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', getBlogs);
router.get('/:id', getBlog);
router.post('/', verifyTokenAndAdmin, createBlog);
router.patch('/:id', verifyTokenAndAdmin, updateBlog);
router.delete('/:id', verifyTokenAndAdmin, deleteBlog);
router.patch('/:id/like', verifyToken, likeBlog); 
router.patch('/:id/dislike', verifyToken, dislikeBlog);

export default router;