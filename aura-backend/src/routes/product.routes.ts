import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  listProductsQuerySchema,
  productSlugParamSchema,
} from "../validations/product.validation";

const router = Router();

router.get("/", validate(listProductsQuerySchema, "query"), productController.list);
router.get(
  "/:slug",
  validate(productSlugParamSchema, "params"),
  productController.detail
);

export default router;
