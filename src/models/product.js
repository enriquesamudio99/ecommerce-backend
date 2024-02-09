import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: { 
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: { 
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: mongoose.Types.ObjectId,
    ref: 'Brand'
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  sold: {
    type: Number,
    required: true,
    default: 0
  },
  images: [
    {
      public_id: String,
      secure_url: String
    }
  ],
  color: {
    type: String,
    required: true
  },
  ratings: [
    {
      star: Number,
      comment: String,
      postedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  totalRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
