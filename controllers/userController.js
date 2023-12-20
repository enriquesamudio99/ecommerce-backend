import User from '../models/User.js';
import { loginSchema, registerSchema } from '../validations/userValidation.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(404).json({
        error: 'Something wrong.'
      });
    }

    const userExists = await User.findOne({
      email: value.email
    });

    if (!userExists) {
      return res.status(404).json({
        error: 'There is no user registered with this email.'
      });
    }

    const validatePassword = await bcrypt.compare(value.password, userExists.password);

    if (!validatePassword) {
      return res.status(404).json({
        error: 'Invalid password.'
      });
    }

    userExists.password = undefined;

    // JWT
    const token = jwt.sign(
      {
        _id: userExists._id,
        name: `${userExists.firstName} ${userExists.lastName}`,
        email: userExists.email,
        phoneNumber: userExists.phoneNumber
      }, 
      process.env.SECRET_WORD,
      {
        expiresIn: '24h'
      }
    );

    return res.status(200).json({
      success: true,
      user: userExists,
      token
    });
  } catch (error) {
    console.log(error);
  }
}

const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(404).json({
        error: 'Something wrong.'
      });
    } 

    const userExists = await User.findOne({
      email: value.email
    });

    if (userExists) {
      return res.status(404).json({
        error: 'There is already a registered user with this email address.'
      });
    }

    const phoneNumberInUse = await User.findOne({
      phoneNumber: value.phoneNumber
    });

    if (phoneNumberInUse) {
      return res.status(404).json({
        error: 'This phone number is already in use.'
      });
    }

    const user = new User(value);

    // Hash Password
    const salt = bcrypt.genSaltSync(); 
    user.password = bcrypt.hashSync(value.password, salt);

    const result = await user.save();
    
    result.password = undefined;

    // JWT
    const token = jwt.sign(
      {
        _id: result._id,
        name: `${result.firstName} ${result.lastName}`,
        email: result.email,
        phoneNumber: result.phoneNumber
      }, 
      process.env.SECRET_WORD,
      {
        expiresIn: '24h'
      }
    )

    return res.status(200).json({
      success: true,
      user: result,
      token
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  login,
  register
} 