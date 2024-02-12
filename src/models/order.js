import mongoose from 'mongoose';
import { CART_ITEM_STATUS } from '../constants';

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      color: String
    }
  ],
  paymentIntent: {

  },
  orderStatus: {
    type: String,
    default: CART_ITEM_STATUS.NOT_PROCESSED,
    enum: [
      CART_ITEM_STATUS.CANCELLED,
      CART_ITEM_STATUS.DELIVERED,
      CART_ITEM_STATUS.NOT_PROCESSED,
      CART_ITEM_STATUS.PROCESSING,
      CART_ITEM_STATUS.SHIPPED
    ]
  },
  orderBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;