import Joi from 'joi';

const productSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(4)
    .required(),
  description: Joi.string()
    .trim()
    .min(20)
    .required(),
  price: Joi.number()
    .min(1)
    .required(),
  category: Joi.string()
    .trim()
    .required(),
  brand: Joi.string()
    .trim()
    .min(3)
    .required(),
  quantity: Joi.number()
    .min(0),
  color: Joi.string()
    .trim()
    .min(3)
    .required() 
});

const rateProductSchema = Joi.object({
  star: Joi.number()
    .min(1)
    .max(5),
  comment: Joi.string()
    .min(10)
});

export {
  productSchema,
  rateProductSchema
}