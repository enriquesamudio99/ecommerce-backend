import Inquiry from '../models/inquiry.js';
import { inquirySchema, inquiryStatusSchema } from '../validations/inquiry.validation.js';
import { validateObjectId } from '../helpers/index.js';

const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find();

    res.json({
      success: true,
      data: inquiries
    });
  } catch (error) {
    console.log(error);
  }
}

const getInquiry = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);

  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }
  
  try {

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found.'
      });
    }

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.log(error);
  }
}

const createInquiry = async (req, res) => {
  const { error, value } = inquirySchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {
    const inquiry = new Inquiry(value);
    const result = await inquiry.save();

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
  }
}

const updateInquiry = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = inquirySchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {  
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found.'
      });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(id, value, { new: true });

    res.json({
      success: true,
      data: updatedInquiry
    });
  } catch (error) {
    console.log(error);
  }
}

const updateInquiryStatus = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = inquiryStatusSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {  
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found.'
      });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(id, { status: value.status }, { new: true });

    res.json({
      success: true,
      data: updatedInquiry
    });
  } catch (error) {
    console.log(error);
  }
}

const deleteInquiry = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const inquiry = await Inquiry.findByIdAndDelete(id);

    if (!inquiry) {  
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found.'
      });
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully.'
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiry,
  updateInquiryStatus,
  deleteInquiry
}