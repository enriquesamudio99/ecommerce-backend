import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import { CART_ITEM_STATUS } from '../constants/index.js';
import { generateRandomId, validateObjectId } from '../helpers/index.js';
import { orderStatusSchema } from '../validations/order.validation.js';

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
    .populate({
      path: 'products.product',
      select: 'price description'
    })
    .populate({
      path: 'orderBy',
      select: 'firstName lastName email phoneNumber'
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.log(error);
  }
}

const getMyOrders = async (req, res) => {

  const { user } = req;

  try {
    const orders = await Order.findOne({ orderBy: user._id })
      .populate({
        path: 'products.product',
        select: 'price description'
      })
      .populate({
        path: 'orderBy',
        select: 'firstName lastName email phoneNumber'
      });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.log(error);
  }
}

const getOrdersByUser = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);

  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const orders = await Order.findOne({ orderBy: id })
      .populate({
        path: 'products.product',
        select: 'price description'
      })
      .populate({
        path: 'orderBy',
        select: 'firstName lastName email phoneNumber'
      });

    if (!orders) {  
      return res.status(404).json({
        success: false,
        error: 'No orders or user doesn"t exist.'
      });
    }

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.log(error);
  }
}

const createOrder = async (req, res) => {
  const { user } = req;
  const { COD, couponApplied } = req.body;

  if (!COD) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  }

  try {

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found.'
      });
    }

    if (cart.products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Empty cart.'
      });
    }

    let finalAmount = 0;

    if (couponApplied && cart.totalPriceAfterDiscount) {
      finalAmount = cart.totalPriceAfterDiscount;
    } else {
      finalAmount = cart.totalPrice;
    }

    const newOrder = new Order({
      products: cart.products,
      paymentIntent: {
        id: generateRandomId(),
        method: 'COD',
        amount: finalAmount,
        status: CART_ITEM_STATUS.CASH_ON_DELIVERY,
        created: Date.now(),
        currency: 'USD'
      },
      orderBy: user._id,
      orderStatus: CART_ITEM_STATUS.CASH_ON_DELIVERY
    });

    const result = await newOrder.save();

    const updateProducts = cart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
      };
    });

    await Product.bulkWrite(updateProducts, {});

    // Empty Cart
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
      data: result 
    });
  } catch (error) {
    console.log(error);
  }
}

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = orderStatusSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong'
    });
  } 
  
  try {

    const order = await Order.findById(id);

    if (!order) {  
      return res.status(404).json({
        success: false,
        error: 'Order not found.'
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: value.status,
        'paymentIntent.status': value.status
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedOrder
    })
  } catch (error) {
    console.log(error);
  }
}

export {
  getAllOrders,
  getMyOrders,
  getOrdersByUser,
  createOrder,
  updateOrderStatus
}