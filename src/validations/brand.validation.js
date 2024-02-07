import Joi from 'joi';

const brandSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(4)
    .required()
});

export {
  brandSchema
}