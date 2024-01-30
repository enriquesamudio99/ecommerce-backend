import Category from '../models/category.js';
import { categorySchema } from '../validations/category.validation.js';
import { validateObjectId } from '../helpers/index.js';

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select('-title_lowercase');

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

    const category = await Category.findById(id).select('-title_lowercase');

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

    const categoryExists = await Category.findOne({
      title_lowercase: value.title.toLowerCase()
    });

    if (categoryExists) {
      return res.status(404).json({
        success: false,
        error: 'This category already exists.'
      });
    }

    const category = new Category(value);
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

export {
  getCategories,
  getCategory,
  createCategory
}