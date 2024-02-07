import mongoose from 'mongoose';

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true 
  },
  description: {
    type: String,
    required: true 
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'BlogCategory'
  },
  numberViews: {
    type: Number,
    default: 0
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  ],
  dislikes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  ],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
