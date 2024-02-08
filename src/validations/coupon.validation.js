import Joi from 'joi';

const couponSchema = Joi.object({
  title: Joi.string()
    .uppercase()
    .min(8),
  discount: Joi.number()
    .min(5)
});

export {
  couponSchema
}