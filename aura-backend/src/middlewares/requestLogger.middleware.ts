import { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const meta = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs),
      ip: req.ip,
    };

    if (res.statusCode >= 500) {
      logger.error("request completed", meta);
    } else if (res.statusCode >= 400) {
      logger.warn("request completed", meta);
    } else {
      logger.info("request completed", meta);
    }
  });

  next();
}
