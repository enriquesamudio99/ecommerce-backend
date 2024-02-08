import { Router } from 'express';
import {  getMyWishList, getWishLists, getWishList, addProductToWishList, removeProductFromWishList } from '../controllers/wishlist.controller.js';
import { verifyTokenAndAdmin, verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/my-wishlist', verifyToken, getMyWishList);
router.get('/', verifyTokenAndAdmin, getWishLists);
router.get('/:id', verifyToken, getWishList);
router.post('/:id/add', verifyToken, addProductToWishList);
router.post('/:id/remove', verifyToken, removeProductFromWishList);

export default router;