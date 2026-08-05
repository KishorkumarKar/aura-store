import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../config/logger";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Unexpected error";

  const logPayload = {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    userId: req.user?.id,
    ...(err instanceof Error ? { stack: err.stack } : {}),
  };

  if (statusCode >= 500) {
    logger.error(message, logPayload);
  } else {
    logger.warn(message, logPayload);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? "Internal server error" : message,
    ...(isApiError && err.details ? { errors: err.details } : {}),
  });
}
