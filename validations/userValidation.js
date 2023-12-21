import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  password: Joi.string()
    .required()
});

const registerSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .required(), 
  lastName: Joi.string()
    .min(3)
    .required(),
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  phoneNumber: Joi.string()
    .min(9)
    .required(),
  password: Joi.string()
    .min(8)
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
});

const updateSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .required(), 
  lastName: Joi.string()
    .min(3)
    .required(),
  email: Joi.string()
    .email()
    .lowercase()
    .required(),
  phoneNumber: Joi.string()
    .min(9)
    .required()
});

export {
  loginSchema,
  registerSchema,
  updateSchema
}