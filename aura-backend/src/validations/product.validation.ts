import Joi from "joi";

export const listProductsQuerySchema = Joi.object({
  category: Joi.string().trim().max(100).optional(),
  // comma-separated color names, e.g. "Sage,Sand"
  color: Joi.string().trim().max(300).optional(),
  // comma-separated price bucket ids, e.g. "0-25,25-50"
  price: Joi.string().trim().max(200).optional(),
  inStock: Joi.boolean().truthy("1").falsy("0").optional(),
  search: Joi.string().trim().max(150).optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string()
    .valid("newest", "price_asc", "price_desc", "rating")
    .default("newest"),
});

export const productSlugParamSchema = Joi.object({
  slug: Joi.string().trim().min(1).max(200).required(),
});
