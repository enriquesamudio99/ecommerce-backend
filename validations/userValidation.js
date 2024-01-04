import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),
  password: Joi.string()
    .trim()
    .required()
});

const registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(3)
    .required(), 
  lastName: Joi.string()
    .trim()
    .min(3)
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),
  phoneNumber: Joi.string()
    .trim()
    .min(9)
    .required(),
  password: Joi.string()
    .trim()
    .min(8)
    .required(),
  confirmPassword: Joi.string()
    .trim()
    .valid(Joi.ref('password'))
    .required()
});

const updateSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(3)
    .required(), 
  lastName: Joi.string()
    .trim()
    .min(3)
    .required(),
  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),
  phoneNumber: Joi.string()
    .trim()
    .min(9)
    .required()
});

export {
  loginSchema,
  registerSchema,
  updateSchema
}