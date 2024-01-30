import Joi from 'joi';

const blogSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(4)
    .required(),
  description: Joi.string()
    .trim()
    .min(20)
    .required(),
  category: Joi.string()
    .trim()
    .min(4)
    .required()
});

export {
  blogSchema
}