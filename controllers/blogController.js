import Blog from '../models/Blog.js';
import { blogSchema } from '../validations/blogValidation.js';
import { validateObjectId } from '../helpers/index.js';

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate({
        path: 'author', 
        select: 'firstName lastName'
      });

    res.json({
      success: true,
      data: blogs
    })

  } catch (error) {
    console.log(error);
  }
}

const getBlog = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);

  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }
  
  try {

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found.'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.log(error);
  }
}

const createBlog = async (req, res) => {

  const { _id } = req.user;
  const userId = _id;

  const { error, value } = blogSchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  }

  try {
    const blog = new Blog(value);
    blog.author = userId;

    const result = await blog.save();

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
  }
}

const updateBlog = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = blogSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const blog = await Blog.findById(id);

    if (!blog) {  
      return res.status(404).json({
        success: false,
        error: 'Blog not found.'
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, value, { new: true });

    res.json({
      success: true,
      data: updatedBlog
    });
  } catch (error) {
    console.log(error);
  } 
}

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {  
      return res.status(404).json({
        success: false,
        error: 'Blog not found.'
      });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully.'
    });
  } catch (error) {
    console.log(error);
  }
}

const likeBlog = async (req, res) => {

  const { id } = req.params;
  const { _id } = req.user;
  const userId = _id;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
      
    const blog = await Blog.findById(id);

    if (!blog) {  
      return res.status(404).json({
        success: false,
        error: 'Blog not found.'
      });
    }

    // Check if the user has disliked the blog
    const indexDisliked = blog.dislikes.findIndex((id) => String(id) === String(userId));

    if (indexDisliked !== -1) {
      blog.dislikes = blog.dislikes.filter((id) => String(id) !== String(userId));
    }

    const index = blog.likes.findIndex((id) => String(id) === String(userId));

    if (index === -1) {
      blog.likes.push(userId);
    } else {
      blog.likes = blog.likes.filter((id) => String(id) !== String(userId));
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });

    res.json({
      success: true,
      message: 'Blog liked successfully.',
      data: updatedBlog
    });

  } catch (error) { 
    console.log(error);
  }

}

const dislikeBlog = async (req, res) => {

  const { id } = req.params;
  const { _id } = req.user;
  const userId = _id;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
      
    const blog = await Blog.findById(id);

    if (!blog) {  
      return res.status(404).json({
        success: false,
        error: 'Blog not found.'
      });
    }

    // Check if the user has disliked the blog
    const indexLiked = blog.likes.findIndex((id) => String(id) === String(userId));

    if (indexLiked !== -1) {
      blog.likes = blog.likes.filter((id) => String(id) !== String(userId));
    }

    const index = blog.dislikes.findIndex((id) => String(id) === String(userId));

    if (index === -1) {
      blog.dislikes.push(userId);
    } else {
      blog.dislikes = blog.dislikes.filter((id) => String(id) !== String(userId));
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });

    res.json({
      success: true,
      message: 'Blog disliked successfully.',
      data: updatedBlog
    });

  } catch (error) { 
    console.log(error);
  }

}

export {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  dislikeBlog
}