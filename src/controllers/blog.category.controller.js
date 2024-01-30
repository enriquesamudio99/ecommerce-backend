import BlogCategory from '../models/blog.category.js';
import { categorySchema } from '../validations/category.validation.js';
import { validateObjectId } from '../helpers/index.js';

const getCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().select('-title_lowercase');

    res.json({
      success: true,
      data:categories
    });
  } catch (error) {
    console.log(error);
  }
}

const getCategory = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);

  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }
  
  try {

    const category = await BlogCategory.findById(id).select('-title_lowercase');

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found.'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.log(error);
  }
}

const createCategory = async (req, res) => {
  const { error, value } = categorySchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const categoryExists = await BlogCategory.findOne({
      title_lowercase: value.title.toLowerCase()
    });

    if (categoryExists) {
      return res.status(404).json({
        success: false,
        error: 'This category already exists.'
      });
    }

    const category = new BlogCategory(value);
    category.title_lowercase = value.title.toLowerCase();
    const result = await category.save();

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
  }
}

const updateCategory = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = categorySchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const category = await BlogCategory.findById(id);

    if (!category) {  
      return res.status(404).json({
        success: false,
        error: 'Category not found.'
      });
    }

    value.title_lowercase = value.title.toLowerCase();

    const titleExists = await BlogCategory.findOne({
      title_lowercase: value.title_lowercase
    });

    if (titleExists) {
      return res.status(404).json({
        success: false,
        error: 'This category title is already in use.'
      });
    }

    const updatedCategory = await BlogCategory.findByIdAndUpdate(id, value, { new: true });

    res.json({
      success: true,
      data: updatedCategory
    });
  } catch (error) {
    console.log(error);
  }
}

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const category = await BlogCategory.findByIdAndDelete(id);

    if (!category) {  
      return res.status(404).json({
        success: false,
        error: 'Blog Category not found.'
      });
    }

    res.json({
      success: true,
      message: 'Blog Category deleted successfully.'
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
}