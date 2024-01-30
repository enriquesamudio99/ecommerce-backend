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
    type: String,
    required: true
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
  images: {
    type: Array
  },
  color: {
    type: String,
    required: true
  },
  ratings: [
    {
      star: Number,
      postedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      }
    }
  ]
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
