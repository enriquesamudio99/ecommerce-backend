import Joi from 'joi';

const colorSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .required(),
  hexCode: Joi.string()
    .trim()
    .uppercase()
    .min(7)
    .required() 
});

export {
  colorSchema
}