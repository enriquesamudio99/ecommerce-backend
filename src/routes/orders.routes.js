import { Router } from 'express';
import { verifyTokenAndAdmin } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyTokenAndAdmin, (req, res) => {
  res.send("<h1>Orders!!</h1>");
});

export default router;