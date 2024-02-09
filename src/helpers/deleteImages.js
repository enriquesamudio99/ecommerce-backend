import { deleteImage } from '../config/cloudinary.js';

const deleteImages = async (files) => {
  for (const file of files){
    const { public_id } = file;
    await deleteImage(public_id);
  } 
}

export default deleteImages;