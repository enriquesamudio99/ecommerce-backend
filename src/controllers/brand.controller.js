import Brand from '../models/brand.js';
import { brandSchema } from '../validations/brand.validation.js';
import { validateObjectId } from '../helpers/index.js';

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().select('-title_lowercase');

    res.json({
      success: true,
      data: brands
    });
  } catch (error) {
    console.log(error);
  }
}

const getBrand = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);

  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }
  
  try {

    const brand = await Brand.findById(id).select('-title_lowercase');

    if (!brand) {
      return res.status(404).json({
        success: false,
        error: 'Brand not found.'
      });
    }

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    console.log(error);
  }
}

const createBrand = async (req, res) => {
  const { error, value } = brandSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const brandExists = await Brand.findOne({
      title_lowercase: value.title.toLowerCase()
    });

    if (brandExists) {
      return res.status(404).json({
        success: false,
        error: 'This brand already exists.'
      });
    }

    const brand = new Brand(value);
    brand.title_lowercase = value.title.toLowerCase();
    const result = await brand.save();

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
  }
}

const updateBrand = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = brandSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const brand = await Brand.findById(id);

    if (!brand) {  
      return res.status(404).json({
        success: false,
        error: 'Brand not found.'
      });
    }

    value.title_lowercase = value.title.toLowerCase();

    const titleExists = await Brand.findOne({
      title_lowercase: value.title_lowercase
    });

    if (titleExists) {
      return res.status(404).json({
        success: false,
        error: 'This brand title is already in use.'
      });
    }

    const updatedBrand = await Brand.findByIdAndUpdate(id, value, { new: true });

    res.json({
      success: true,
      data: updatedBrand
    });
  } catch (error) {
    console.log(error);
  }
}

const deleteBrand = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {  
      return res.status(404).json({
        success: false,
        error: 'Brand not found.'
      });
    }

    res.json({
      success: true,
      message: 'Brand deleted successfully.'
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand
}