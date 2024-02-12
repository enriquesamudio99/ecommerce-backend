import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      color: String,
      price: Number
    }
  ],
  totalPrice: {
    type: Number
  },
  totalPriceAfterDiscount: {
    type: Number
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;