import Blog from '../models/blog.js';
import { blogSchema } from '../validations/blog.validation.js';
import { validateObjectId } from '../helpers/index.js';

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate({
        path: 'author', 
        select: 'firstName lastName'
      })
      .sort('-createdAt');

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

    const blog = await Blog.findByIdAndUpdate(id, { $inc: { numberViews: 1 } }, { new: true })
      .populate({
        path: 'likes', 
        select: 'firstName lastName'
      })  
      .populate({
        path: 'dislikes', 
        select: 'firstName lastName'
      }) 
      .populate({
        path: 'author', 
        select: 'firstName lastName'
      });

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

  console.log(req.user);

  const { id } = req.params;
  const { _id:userId } = req.user;

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

    const index = blog.likes.findIndex((id) => String(id) === String(userId));

    if (index === -1) {
      await Blog.findByIdAndUpdate(
        id, 
        {
          $push: { likes: userId },
          $pull: { dislikes: userId },
        }, 
        { new: true }
      );

      return res.json({
        success: true,
        message: 'Blog liked successfully.'
      });
    } else {
      await Blog.findByIdAndUpdate(
        id, 
        {
          $pull: { likes: userId }
        }, 
        { new: true }
      );

      return res.json({
        success: true,
        message: 'Like removed successfully..'
      });
    }
  } catch (error) { 
    console.log(error);
  }

}

const dislikeBlog = async (req, res) => {

  const { id } = req.params;
  const { _id:userId } = req.user;

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

    const index = blog.dislikes.findIndex((id) => String(id) === String(userId));

    if (index === -1) {
      await Blog.findByIdAndUpdate(
        id, 
        {
          $push: { dislikes: userId },
          $pull: { likes: userId },
        }, 
        { new: true }
      );

      return res.json({
        success: true,
        message: 'Blog disliked successfully.'
      });
    } else {
      await Blog.findByIdAndUpdate(
        id, 
        {
          $pull: { dislikes: userId }
        }, 
        { new: true }
      );

      return res.json({
        success: true,
        message: 'Dislike removed successfully..'
      });
    }
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