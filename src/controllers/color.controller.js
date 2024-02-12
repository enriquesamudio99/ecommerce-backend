import Color from '../models/color.js';
import { colorSchema } from '../validations/color.validation.js';
import { validateObjectId } from '../helpers/index.js';

const getColors = async (req, res) => {
  try {
    const colors = await Color.find().select('-title_lowercase');

    res.json({
      success: true,
      data: colors
    });
  } catch (error) {
    console.log(error);
  }
}

const getColor = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);

  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }
  
  try {

    const color = await Color.findById(id).select('-title_lowercase');

    if (!color) {
      return res.status(404).json({
        success: false,
        error: 'Color not found.'
      });
    }

    res.json({
      success: true,
      data: color
    });
  } catch (error) {
    console.log(error);
  }
}

const createColor = async (req, res) => {
  const { error, value } = colorSchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const colorExists = await Color.findOne({
      title_lowercase: value.title.toLowerCase()
    });

    if (colorExists) {
      return res.status(404).json({
        success: false,
        error: 'This color already exists.'
      });
    }

    const color = new Color(value);
    color.title_lowercase = value.title.toLowerCase();
    const result = await color.save();

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log(error);
  }
}

const updateColor = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = colorSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {

    const color = await Color.findById(id);

    if (!color) {  
      return res.status(404).json({
        success: false,
        error: 'Color not found.'
      });
    }

    value.title_lowercase = value.title.toLowerCase();

    const colorExists = await Color.findOne({
      title_lowercase: value.title_lowercase
    });

    if (colorExists) {
      return res.status(404).json({
        success: false,
        error: 'This color title is already in use.'
      });
    }

    const updatedColor = await Color.findByIdAndUpdate(id, value, { new: true });

    res.json({
      success: true,
      data: updatedColor
    });
  } catch (error) {
    console.log(error);
  }
}

const deleteColor = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const color = await Color.findByIdAndDelete(id);

    if (!color) {  
      return res.status(404).json({
        success: false,
        error: 'Color not found.'
      });
    }

    res.json({
      success: true,
      message: 'Color deleted successfully.'
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  getColors,
  getColor,
  createColor,
  updateColor,
  deleteColor
}