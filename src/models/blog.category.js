import mongoose from 'mongoose';

const blogCategorySchema = new mongoose.Schema({
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

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);

export default BlogCategory;