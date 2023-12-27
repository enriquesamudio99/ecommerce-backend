import User from '../models/User.js';
import { loginSchema, registerSchema, updateSchema } from '../validations/userValidation.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateObjectId, generateRefreshToken, generateToken  } from '../helpers/index.js';

const loginUser = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  }

  try {
    const userExists = await User.findOne({
      email: value.email
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        error: 'There is no user registered with this email.'
      });
    }

    const validatePassword = await bcrypt.compare(value.password, userExists.password);

    if (!validatePassword) {
      return res.status(404).json({
        success: false,
        error: 'Invalid password.'
      });
    }

    const refreshToken = generateRefreshToken({
      _id: userExists._id,
      name: `${userExists.firstName} ${userExists.lastName}`,
      email: userExists.email,
      phoneNumber: userExists.phoneNumber,
      role: userExists.role
    });

    await User.findByIdAndUpdate(userExists._id, { refreshToken }, { new: true });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000
    });

    userExists.password = undefined;

    // JWT
    const token = generateToken({
      _id: userExists._id,
      name: `${userExists.firstName} ${userExists.lastName}`,
      email: userExists.email,
      phoneNumber: userExists.phoneNumber,
      role: userExists.role
    });

    return res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    console.log(error);
  }
}

const registerUser = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  } 

  try {
    const userExists = await User.findOne({
      email: value.email
    });

    if (userExists) {
      return res.status(404).json({
        success: false,
        error: 'There is already a registered user with this email address.'
      });
    }

    const phoneNumberInUse = await User.findOne({
      phoneNumber: value.phoneNumber
    });

    if (phoneNumberInUse) {
      return res.status(404).json({
        success: false,
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
    const token = generateToken({
      _id: result._id,
      name: `${result.firstName} ${result.lastName}`,
      email: result.email,
      phoneNumber: result.phoneNumber,
      role: result.role
    });

    return res.status(200).json({
      success: true,
      data: result,
      token 
    });
  } catch (error) {
    console.log(error);
  }
}

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    return res.status(404).json({
      success: false,
      error: 'No refresh token.'
    });
  }

  const refreshToken = cookies?.refreshToken;

  const userWithToken = await User.findOne({ refreshToken });

  if (!userWithToken) {
    return res.status(404).json({
      success: false,
      error: 'Token not found.'
    });
  }
 
  try {
    
    const decodedData = jwt.verify(refreshToken, process.env.SECRET_WORD);

    if (!userWithToken._id.equals(decodedData._id)) {
      return res.status(401).json({
        error: 'Something wrong.'
      });
    }

    const accessToken = generateToken({
      _id: userWithToken._id,
      name: `${userWithToken.firstName} ${userWithToken.lastName}`,
      email: userWithToken.email,
      phoneNumber: userWithToken.phoneNumber,
      role: userWithToken.role
    });

    res.json({
      accessToken
    });

  } catch (error) {
    return res.status(401).json({
      error: 'Invalid token.'
    });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select({ password: 0, role: 0 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.log(error);
  }
}

const getUser = async (req, res) => {
  
  const { id } = req.params;

  const isValidId = validateObjectId(id);

  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const user = await User.findById(id).select({ password: 0, role: 0 });

    if (!user) {  
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.log(error);
  }
}

const updateUser = async (req, res) => {

  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  const { error, value } = updateSchema.validate(req.body);

  if (error) {
    return res.status(404).json({
      success: false,
      error: 'Something wrong.'
    });
  }


  try {
    const user = await User.findById(id);

    if (!user) {  
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    if (value.email !== user.email) {
      const emailInUse = await User.findOne({
        email: value.email
      });
  
      if (emailInUse) {
        return res.status(404).json({
          success: false,
          error: 'There is already a registered user with this email address.'
        });
      }
    }

    if (value.phoneNumber !== user.phoneNumber) {
      const phoneNumberInUse = await User.findOne({
        phoneNumber: value.phoneNumber
      });
  
      if (phoneNumberInUse) {
        return res.status(404).json({
          success: false,
          error: 'This phone number is already in use.'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, value, { new: true });

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.log(error);
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }
 
  try {
    
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully.'
    });

  } catch (error) {
    console.log(error);
  }
}

const blockUser = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const user = await User.findById(id);

    if (!user) {  
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    if (user.isBlocked) {  
      return res.status(404).json({
        success: false,
        error: 'This user is already blocked.'
      });
    }

    await User.findByIdAndUpdate(id, { ...user._doc, isBlocked: true }, { new: true });

    res.json({
      success: true,
      message: 'User blocked successfully.'
    });

  } catch (error) {
    console.log(error);
  }
}

const unblockUser = async (req, res) => {
  const { id } = req.params;

  const isValidId = validateObjectId(id);
  
  if (!isValidId) {  
    return res.status(404).json({
      success: false,
      error: 'Invalid object id.'
    });
  }

  try {
    const user = await User.findById(id);

    if (!user) {  
      return res.status(404).json({
        success: false,
        error: 'User not found.'
      });
    }

    if (!user.isBlocked) {  
      return res.status(404).json({
        success: false,
        error: 'This user is already unblocked.'
      });
    }

    await User.findByIdAndUpdate(id, { ...user._doc, isBlocked: false }, { new: true });

    res.json({
      success: true,
      message: 'User unblocked successfully.'
    });

  } catch (error) {
    console.log(error);
  }
}

export {
  loginUser,
  registerUser,
  handleRefreshToken,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser
}