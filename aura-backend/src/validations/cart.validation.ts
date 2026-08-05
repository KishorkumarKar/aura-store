import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().uuid().required(),
  variantId: Joi.string().uuid().optional().allow(null),
  quantity: Joi.number().integer().min(1).max(99).default(1),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(99).required(),
});

export const cartItemParamSchema = Joi.object({
  itemId: Joi.string().uuid().required(),
});
