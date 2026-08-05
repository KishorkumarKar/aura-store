import "reflect-metadata";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { requestLogger } from "./middlewares/requestLogger.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import {
  categoryRouter,
  bannerRouter,
  featureRouter,
  homeRouter,
} from "./routes/home.routes";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok", uptime: process.uptime() } });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRouter);
  app.use("/api/banners", bannerRouter);
  app.use("/api/features", featureRouter);
  app.use("/api/home", homeRouter);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
