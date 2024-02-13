import mongoose from 'mongoose';
import { INQUIRY_STATUS } from '../constants/index.js';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: INQUIRY_STATUS.SUBMITTED,
    enum: [
      INQUIRY_STATUS.CONTACTED,
      INQUIRY_STATUS.IN_PROGRESS,
      INQUIRY_STATUS.RESOLVED,
      INQUIRY_STATUS.SUBMITTED
    ],
    required: true
  }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;