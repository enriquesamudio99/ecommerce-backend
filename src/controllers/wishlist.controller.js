import WishList from '../models/wishlist.js';
import { validateObjectId, verifyIsAdmin } from '../helpers/index.js';

const getMyWishList = async (req, res) => {

  const { user } = req;

  try {
    const wishList = await WishList.findOne({ user: user._id })
      .populate({
        path: 'products',
        select: "title"
      });

    if (!wishList) {
      return res.status(404).json({
        success: false,
        error: 'WishList not found.'
      });
    }

    if (user._id !== wishList.user.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized.'
      });
    }

    res.json({
      success: true, 
      data: wishList
    });
  } catch (error) {
    console.log(error);
  }
}

const getWishLists = async (req, res) => {
  try {
    const wishLists = await WishList.find()
      .populate({
        path: 'products',
        select: "title"
      });

    res.json({
      success: true, 
      data: wishLists
    })
  } catch (error) {
    console.log(error);
  }
}

const getWishList = async (req, res) => {

  const { id } = req.params;
  const { user } = req;

  const isValidId = validateObjectId(id);

  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const wishList = await WishList.findById(id)
      .populate({
        path: 'products',
        select: "title"
      });

    if (!wishList) {
      return res.status(404).json({
        success: false,
        error: 'WishList not found.'
      });
    }

    if (user._id !== wishList.user.toString() && !verifyIsAdmin(user)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized.'
      });
    }

    res.json({
      success: true, 
      data: wishList
    });
  } catch (error) {
    console.log(error);
  }
}

const addProductToWishList = async (req, res) => {

  const { id } = req.params;
  const { productId } = req.body;
  const { user } = req;

  const isValidId = validateObjectId(id);
  const isValidProductId = validateObjectId(productId);

  if (!isValidId || !isValidProductId) {
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const wishList = await WishList.findById(id);

    if (!wishList) {
      return res.status(404).json({
        success: false,
        error: 'WishList not found.'
      });
    }

    if ((user._id !== wishList.user.toString()) && !verifyIsAdmin(user)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized.'
      });
    }

    const alreadyAdded = wishList.products.findIndex((id) => String(id) === String(productId));

    if (alreadyAdded !== -1) {
      return res.status(404).json({
        success: false,
        error: 'Product already added.'
      });
    }

    const updatedWishList = await WishList.findByIdAndUpdate(
      id, 
      {
        $push: { products: productId }
      }, 
      { new: true }
    );

    res.json({
      success: true,
      data: updatedWishList
    });
  } catch (error) {
    console.log(error);
  }
}

const removeProductFromWishList = async (req, res) => {

  const { id } = req.params;
  const { productId } = req.body;
  const { user } = req;

  const isValidId = validateObjectId(id);
  const isValidProductId = validateObjectId(productId);

  if (!isValidId || !isValidProductId) {
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const wishList = await WishList.findById(id);

    if (!wishList) {
      return res.status(404).json({
        success: false,
        error: 'WishList not found.'
      });
    }

    if ((user._id !== wishList.user.toString()) && !verifyIsAdmin(user)) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized.'
      });
    }

    const alreadyAdded = wishList.products.findIndex((id) => String(id) === String(productId));

    if (alreadyAdded === -1) {
      return res.status(404).json({
        success: false,
        error: 'This product is not added.'
      });
    }

    const updatedWishList = await WishList.findByIdAndUpdate(
      id, 
      {
        $pull: { products: productId }
      }, 
      { new: true }
    );

    res.json({
      success: true,
      data: updatedWishList
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  getWishLists,
  getWishList,
  getMyWishList,
  addProductToWishList,
  removeProductFromWishList
}