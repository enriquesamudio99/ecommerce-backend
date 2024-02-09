import Product from '../models/product.js';
import { productSchema, rateProductSchema } from '../validations/product.validation.js';
import { generateSlug, validateObjectId } from '../helpers/index.js';
import uploadImages from '../helpers/uploadImages.js';
import deleteImages from '../helpers/deleteImages.js';

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

    productsQuery = productsQuery
      .populate({ path: 'category', select: 'title' })
      .populate({ path: 'brand', select: 'title' })
      .limit(LIMIT)
      .skip(startIndex);
    
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

    const product = await Product.findById(id)
      .populate({ path: 'category', select: 'title' })
      .populate({ path: 'brand', select: 'title' });

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

  if (!req.files || req.files.length === 0) {
    return res.json({
      success: false,  
      message: 'You must upload at least one image'
    })
  };

  const { error, value } = productSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {
    const images = await uploadImages(req.files);

    const product = new Product(value);
    product.slug = generateSlug(product.title);
    product.images = images;

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
    const product = await Product.findById(id);

    if (!product) {  
      return res.status(404).json({
        success: false,
        error: 'Product not found.'
      });
    }

    await deleteImages(product.images);
    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error) {
    console.log(error);
  }
}

const rateProduct = async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = rateProductSchema.validate(req.body);

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

    const alreadyRated = product.ratings.find((rating) => String(rating.postedBy) === String(user._id));

    if (alreadyRated) {
      await Product.updateOne(
        {
          ratings: {
            $elemMatch: alreadyRated
          }
        },
        {
          $set: {
            "ratings.$.star": value.star,
            "ratings.$.comment": value.comment
          }
        },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(
        id,
        {
          $push: {
            ratings: {
              star: value.star,
              comment: value.comment,
              postedBy: user._id
            }
          }
        },
        { new: true }
      );
    }

    const allRatings = await Product.findById(id);
    const numberRatings = allRatings.ratings.length;
    const ratingsSum = allRatings.ratings
      .map((rating) => rating.star)
      .reduce((prev, current) => prev + current, 0);
    const totalRating = Math.round(ratingsSum / numberRatings) || 0;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { totalRating },
      { new: true }
    );

    res.json({ 
      success: true,
      updatedProduct
    });
  } catch (error) {
    console.log(error);
  }
}

const removeRateFromProduct = async (req, res) => {
  const { user } = req;
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

    const rate = product.ratings.find((rating) => String(rating.postedBy) === String(user._id));

    if (!rate) {
      return res.status(404).json({
        success: false,
        error: 'Rate not found.'
      });
    }

    await Product.updateOne(
      {
        ratings: {
          $elemMatch: rate
        }
      },
      {
        $pull: {
          ratings: rate
        }
      },
      { new: true }
    );

    const allRatings = await Product.findById(id);
    const numberRatings = allRatings.ratings.length;
    const ratingsSum = allRatings.ratings
      .map((rating) => rating.star)
      .reduce((prev, current) => prev + current, 0);
    const totalRating = Math.round(ratingsSum / numberRatings) || 0;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { totalRating },
      { new: true }
    );

    res.json({
      success: true,
      updatedProduct
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
  deleteProduct,
  rateProduct,
  removeRateFromProduct
}