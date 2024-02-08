import mongoose from 'mongoose';

const wishListSchema = mongoose.Schema({
  products: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Product'
    }
  ],
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    unique: true
  }
}, {
  timestamps: true
});

const WishList = mongoose.model('WishList', wishListSchema);

export default WishList;