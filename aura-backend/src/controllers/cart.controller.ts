import { Request, Response } from "express";
import { cartService } from "../services/cart.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { ApiError } from "../utils/ApiError";

export const cartController = {
  get: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    sendSuccess(res, await cartService.getCart(req.user.id));
  }),

  addItem: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const cart = await cartService.addItem(req.user.id, req.body);
    sendSuccess(res, cart, 201);
  }),

  updateItem: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { itemId } = req.params;
    const cart = await cartService.updateQuantity(req.user.id, itemId, req.body.quantity);
    sendSuccess(res, cart);
  }),

  removeItem: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { itemId } = req.params;
    const cart = await cartService.removeItem(req.user.id, itemId);
    sendSuccess(res, cart);
  }),

  clear: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    await cartService.clearCart(req.user.id);
    sendSuccess(res, { message: "Cart cleared" });
  }),
};
