import Joi from "joi";

export const placeOrderSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  firstName: Joi.string().trim().min(1).max(100).required(),
  lastName: Joi.string().trim().min(1).max(100).required(),
  address: Joi.string().trim().min(1).max(255).required(),
  city: Joi.string().trim().min(1).max(100).required(),
  state: Joi.string().trim().min(1).max(100).required(),
  zip: Joi.string().trim().pattern(/^\d{4,10}$/).required().messages({
    "string.pattern.base": "Enter a valid postal code",
  }),

  // Demo-only mock payment fields — format-validated, never stored or
  // sent to a real payment processor.
  cardNumber: Joi.string()
    .pattern(/^\d{13,19}$/)
    .required()
    .messages({ "string.pattern.base": "Enter a valid card number" }),
  expiry: Joi.string()
    .pattern(/^\d{2}\s*\/\s*\d{2}$/)
    .required()
    .messages({ "string.pattern.base": "Use MM / YY" }),
  cvc: Joi.string()
    .pattern(/^\d{3,4}$/)
    .required()
    .messages({ "string.pattern.base": "Enter a valid CVC" }),
});

export const orderNumberParamSchema = Joi.object({
  orderNumber: Joi.string().trim().min(1).max(20).required(),
});
