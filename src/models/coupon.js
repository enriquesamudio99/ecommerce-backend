import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  expiry: {
    type: Date,
    required: true
  },
  discount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;