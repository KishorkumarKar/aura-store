import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { RevokedToken } from "../entities/RevokedToken";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
      tokenJti?: string;
      tokenExp?: Date;
    }
  }
}

export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw ApiError.unauthorized("Missing or malformed Authorization header");
    }

    const token = header.slice("Bearer ".length).trim();

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw ApiError.unauthorized("Invalid or expired token");
    }

    const revokedRepo = AppDataSource.getRepository(RevokedToken);
    const revoked = await revokedRepo.findOneBy({ jti: payload.jti });
    if (revoked) {
      throw ApiError.unauthorized("Token has been revoked");
    }

    req.user = { id: payload.sub, email: payload.email };
    req.tokenJti = payload.jti;
    req.tokenExp = payload.exp ? new Date(payload.exp * 1000) : new Date(Date.now() + 60 * 60 * 1000);
    next();
  }
);
