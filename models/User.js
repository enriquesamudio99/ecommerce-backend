import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true 
  }, 
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 10
  },
  cart: {
    type: Array,
    default: []
  },
  address: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Address'
    }
  ],
  wishList: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Product'
    }
  ]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;  