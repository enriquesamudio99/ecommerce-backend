import jwt from 'jsonwebtoken';
import { ADMIN_ROLE } from '../config/env.js';

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

    if (!token) {
      return res.status(401).json({
        error: 'No token on request.'
      });
    }
 
    let decodedData;
 
    try {
      decodedData = jwt.verify(token, process.env.SECRET_WORD);
      req.user = decodedData;
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid token.'
      });
    }

    next();
  } catch (error) {
    console.log(error); 
  }
}

const verifyTokenAndUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id === req.params.id || req.user.role === ADMIN_ROLE) {
      next();
    } else {
      res.status(403).json({
        error: 'Unauthorized'
      });
    }
  });
}; 

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === ADMIN_ROLE) {
      next();
    } else {
      res.status(403).json({
        error: 'Unauthorized.'
      });
    }
  });
};

export {
  verifyToken,
  verifyTokenAndUser,
  verifyTokenAndAdmin
};