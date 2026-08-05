import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

export const orderController = {
  placeOrder: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const order = await orderService.placeOrder(req.user.id, req.body);
    sendSuccess(res, order, 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    sendSuccess(res, await orderService.listForUser(req.user.id));
  }),

  detail: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { orderNumber } = req.params;
    sendSuccess(res, await orderService.getByOrderNumber(req.user.id, orderNumber));
  }),
};
