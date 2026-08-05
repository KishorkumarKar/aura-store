import "reflect-metadata";
import { createApp } from "./app";
import { AppDataSource } from "./config/data-source";
import { env } from "./config/env";
import { logger } from "./config/logger";

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established");

    const app = createApp();
    const server = app.listen(env.port, () => {
      logger.info(`Aura backend listening on port ${env.port} (${env.nodeEnv})`);
    });

    const shutdown = (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`);
      server.close(async () => {
        await AppDataSource.destroy();
        logger.info("Database connection closed. Bye.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    logger.error("Failed to start server", { error: (err as Error).message });
    process.exit(1);
  }
}

bootstrap();
