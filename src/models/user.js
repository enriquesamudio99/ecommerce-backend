import mongoose from 'mongoose';
import { USER_ROLE } from '../config/env.js';

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
    type: Number,
    default: USER_ROLE
  },
  address: {
    type: String
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: String
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
