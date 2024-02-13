import Joi from 'joi';
import { INQUIRY_STATUS } from '../constants/index.js';

const inquirySchema = Joi.object({
  name: Joi.string()
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
  comment: Joi.string()
    .trim()
    .min(10)
    .required(),
  status: Joi.string()
    .valid(
      INQUIRY_STATUS.CONTACTED,
      INQUIRY_STATUS.IN_PROGRESS,
      INQUIRY_STATUS.RESOLVED,
      INQUIRY_STATUS.SUBMITTED
    )
    .required()
});

const inquiryStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      INQUIRY_STATUS.CONTACTED,
      INQUIRY_STATUS.IN_PROGRESS,
      INQUIRY_STATUS.RESOLVED,
      INQUIRY_STATUS.SUBMITTED
    )
    .required()
});

export {
  inquirySchema,
  inquiryStatusSchema
}