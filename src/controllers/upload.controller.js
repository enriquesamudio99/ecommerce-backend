import Product from '../models/product.js';
import { validateObjectId } from '../helpers/index.js';
import uploadImages from '../helpers/uploadImages.js';

const uploadProductImages = async (req, res) => {
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

    const images = await uploadImages(req.files);

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $push: {
          images
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  uploadProductImages
}