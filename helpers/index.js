import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
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
  generateRefreshToken,
  generateToken
}