import Joi from 'joi';
import { CART_ITEM_STATUS } from '../constants/index.js';

const orderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      CART_ITEM_STATUS.CANCELLED,
      CART_ITEM_STATUS.CASH_ON_DELIVERY,
      CART_ITEM_STATUS.DELIVERED,
      CART_ITEM_STATUS.DISPATCHED,
      CART_ITEM_STATUS.NOT_PROCESSED,
      CART_ITEM_STATUS.PROCESSING
    )
    .required()
});

export {
  orderStatusSchema
}