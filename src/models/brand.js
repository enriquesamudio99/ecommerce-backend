import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  title_lowercase: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const Brand = mongoose.model('Brand', brandSchema);

export default Brand;