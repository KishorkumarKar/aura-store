import { Request, Response } from "express";
import { homeService } from "../services/home.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";

export const homeController = {
  banners: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await homeService.listBanners());
  }),

  features: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await homeService.listFeatures());
  }),

  featured: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await homeService.getFeaturedProducts());
  }),

  home: asyncHandler(async (_req: Request, res: Response) => {
    sendSuccess(res, await homeService.getHomePayload());
  }),
};
