import { Request, Response } from "express";
import { productService, ListProductsInput } from "../services/product.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";

export const productController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ListProductsInput;
    const { products, meta } = await productService.list(query);
    sendSuccess(res, products, 200, meta);
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const result = await productService.getBySlug(slug);
    sendSuccess(res, result);
  }),

  categories: asyncHandler(async (_req: Request, res: Response) => {
    const categories = await productService.listCategories();
    sendSuccess(res, categories);
  }),
};
