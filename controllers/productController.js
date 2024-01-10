import Product from '../models/Product.js';
import { productSchema } from '../validations/productValidation.js';
import { generateSlug, validateObjectId } from '../helpers/index.js';

const getProducts = async (req, res) => {

  // Get sort and fields for query
  const { searchTerm, sort, fields, limit } = req.query;

  // Products Query
  let productsQuery = Product;

  // Pagination
  const page = Number(req.query.page) || 1;
  const LIMIT = limit || 10;
  const startIndex = (page - 1) * LIMIT;

  // Filtering
  const filtersObj = { ...req.query };
  const excludeFields = 
    searchTerm 
      ? ['page', 'sort', 'limit', 'fields', 'searchTerm', 'title', 'description', 'brand'] 
      : ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach((element) => delete filtersObj[element]);
  let filters = JSON.stringify(filtersObj); 
  filters = JSON.parse(filters.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`));

  if (searchTerm) {
    filters.$or = [{ title: new RegExp(searchTerm, 'i') }, { description: new RegExp(searchTerm, 'i') }, { brand: new RegExp(searchTerm, 'i') }]
  }

  // Add filters to query 
  productsQuery = productsQuery.find(filters);

  // Add sort to query
  if (sort) {
    const sortBy = sort.split(',').join(' ');
    productsQuery = productsQuery.sort(sortBy);
  } else {
    productsQuery = productsQuery.sort('-createdAt');
  }

  // Add fields to query
  if (fields) { 
    const fieldsObj = fields.split(',').join(' ');
    productsQuery = productsQuery.select(fieldsObj);
  } else {
    productsQuery = productsQuery.select('-__v');
  }
 
  try {  
    const total = await Product.countDocuments(filters);
 
    if (startIndex > total) {
      return res.status(404).json({
        success: false,
        error: 'Invalid page number.'
      });
    }

    productsQuery = productsQuery.limit(LIMIT).skip(startIndex);
    const products = await productsQuery;

    res.json({
      success: true, 
      data: products, 
      totalProducts: total,
      currentPage: page,
      totalPages: Math.ceil(total / LIMIT)
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
    });
  } catch (error) {
    console.log(error);
  }
}

const createProduct = async (req, res) => {

  const { error, value } = productSchema.validate(req.body);

  if (error) {
    console.log(error);
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
    const product = await Product.findByIdAndDelete(id);

    if (!product) {  
      return res.status(404).json({
        success: false,
        error: 'Product not found.'
      });
    }

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