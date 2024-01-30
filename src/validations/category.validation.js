import Joi from 'joi';

const categorySchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(4)
    .required()
});

export {
  categorySchema
}