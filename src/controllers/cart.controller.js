import Cart from '../models/cart.js';
import Product from '../models/product.js';
import Coupon from '../models/coupon.js';

const getMyCart = async (req, res) => {
  const { user } = req;

  try {
    const cart = await Cart.findOne({ user: user._id })
      .populate({
        path: 'products.product',
        select: 'title price'
      });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found.'
      });
    }

    res.json({
      success: true, 
      data: cart
    });
  } catch (error) {
    console.log(error);
  }
}

const updateCart = async (req, res) => {

  const { user } = req;
  const { cart:cartArr } = req.body;
  const products = [];

  try {
    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found.'
      });
    }

    for (let i = 0; i < cartArr.length; i++) {
      let productObj = {};
      productObj.product = cartArr[i]._id;
      productObj.quantity = cartArr[i].quantity;
      productObj.color = cartArr[i].color;
      let getPrice = await Product.findById(cartArr[i]._id).select("price").exec();
      productObj.price = getPrice.price;
      products.push(productObj);
    }
    let totalPrice = 0;
    for (let i = 0; i < products.length; i++) {
      totalPrice = totalPrice + products[i].price * products[i].quantity;
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user: user._id },
      {
        products,
        totalPrice
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedCart
    });
  } catch (error) {
    console.log(error);
  }
}

const emptyCart = async (req, res) => {
  const { user } = req;

  try {
    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found.'
      });
    }

    await Cart.findOneAndUpdate(
      { user: user._id },
      {
        products: [],
        totalPrice: 0,
        totalPriceAfterDiscount: 0
      }
    );

    res.json({
      success: true, 
      data: 'Cart emptied successfully'
    });
  } catch (error) {
    console.log(error);
  }
}

const applyCoupon = async (req, res) => {

  const { user } = req;
  const { coupon } = req.body;

  try {
    const validCoupon = await Coupon.findOne({ title: coupon, expiry: { $gt: Date.now() } });

    if (!validCoupon) {
      return res.status(404).json({
        success: false,
        error: 'Invalid coupon.'
      });
    }

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found.'
      });
    }

    const totalPriceAfterDiscount = (cart.totalPrice - (cart.totalPrice * validCoupon.discount) / 100).toFixed(2);

    const updatedCart = await Cart.findOneAndUpdate(
      { user: user._id }, 
      {
        totalPriceAfterDiscount
      }, 
      { new: true }
    );

    res.json({
      success: true,
      data: updatedCart
    })
  } catch (error) {
    console.log(error);
  }
}

export {
  getMyCart,
  updateCart,
  emptyCart,
  applyCoupon
};