import Product from '../models/Product.js';
import { productSchema } from '../validations/productValidation.js';
import { generateSlug, validateObjectId } from '../helpers/index.js';

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 'desc' });

    res.json({
      success: true, 
      data: products
    });
  } catch (error) {
    console.log(error);
  }
}

const getProduct = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);

  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }
  
  try {

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found.'
      });
    }

    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.log(error);
  }
}

const createProduct = async (req, res) => {

  const { error, value } = productSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {
    const product = new Product(value);
    product.slug = generateSlug(product.title);

    const result = await product.save();

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
  } 
}

const updateProduct = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = productSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const product = await Product.findById(id);

    if (!product) {  
      return res.status(404).json({
        success: false,
        error: 'Product not found.'
      });
    }

    if (product.title !== value.title) {
      value.slug = generateSlug(value.title);
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(id, value, { new: true });

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.log(error);
  } 
}

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
}