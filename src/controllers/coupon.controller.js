import Coupon from '../models/coupon.js';
import { couponSchema } from '../validations/coupon.validation.js';
import { validateObjectId } from '../helpers/index.js';

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.json({
      success: true,
      data: coupons
    });
  } catch (error) {
    console.log(error);
  }
}

const getCoupon = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const coupon = await Coupon.findById(id).select('-title_lowercase');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Coupon not found.'
      });
    }

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.log(error);
  }
}

const createCoupon = async (req, res) => {

  const { error, value } = couponSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  // Remove spaces from title
  value.title = value.title.replace(" ", "");

  try {
    const couponExists = await Coupon.findOne({
      title: value.title
    });

    if (couponExists) {
      return res.status(404).json({
        success: false,
        error: 'This coupon already exists.'
      });
    }

    const coupon = new Coupon(value);
    coupon.expiry = "2024-02-20T18:30:15.735Z";

    const result = await coupon.save();

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
  }
}

const updateCoupon = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = couponSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  // Remove spaces from title
  value.title = value.title.replace(" ", "");

  try {
    const coupon = await Coupon.findById(id);

    if (!coupon) {  
      return res.status(404).json({
        success: false,
        error: 'Coupon not found.'
      });
    }

    if (value.title !== coupon.title) {
      const titleExists = await Coupon.findOne({
        title: value.title
      });
  
      if (titleExists) {
        return res.status(404).json({
          success: false,
          error: 'This title is already in use.'
        });
      }
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      id,
      value,
      { new: true }
    );

    res.json({
      success: true,
      data: updatedCoupon
    });
  } catch (error) {
    console.log(error);
  }
}

const deleteCoupon = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {  
      return res.status(404).json({
        success: false,
        error: 'Coupon not found.'
      });
    }

    res.json({
      success: true,
      message: 'Coupon deleted successfully.'
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
}