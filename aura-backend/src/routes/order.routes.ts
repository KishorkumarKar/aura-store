import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { placeOrderSchema, orderNumberParamSchema } from "../validations/order.validation";

const router = Router();

router.use(requireAuth);

router.post("/", validate(placeOrderSchema), orderController.placeOrder);
router.get("/", orderController.list);
router.get(
  "/:orderNumber",
  validate(orderNumberParamSchema, "params"),
  orderController.detail
);

export default router;
