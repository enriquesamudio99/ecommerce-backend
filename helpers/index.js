import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';

const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
}

const generateRandomId = () => {
  return Math.random().toString(32).substring(2, 10);
}

const generateSlug = (title) => {
  return `${generateRandomId()}-${slugify(title, { lower: true })}`
} 

const generateRefreshToken = (data) => {
  return jwt.sign(
    data, 
    process.env.SECRET_WORD,
    {
      expiresIn: '24h'
    }
  );
}

const generateToken = (data) => {
  return jwt.sign(
    data, 
    process.env.SECRET_WORD,
    {
      expiresIn: '12h'
    }
  );
}

export {
  validateObjectId,
  generateRandomId,
  generateSlug,
  generateRefreshToken,
  generateToken
}