import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemParamSchema,
} from "../validations/cart.validation";

const router = Router();

router.use(requireAuth);

router.get("/", cartController.get);
router.post("/", validate(addToCartSchema), cartController.addItem);
router.patch(
  "/:itemId",
  validate(cartItemParamSchema, "params"),
  validate(updateCartItemSchema),
  cartController.updateItem
);
router.delete(
  "/:itemId",
  validate(cartItemParamSchema, "params"),
  cartController.removeItem
);
router.delete("/", cartController.clear);

export default router;
