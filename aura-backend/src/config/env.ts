import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // Fail fast on boot rather than surfacing confusing errors later.
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "4000", 10),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",

  db: {
    host: required("DB_HOST", "localhost"),
    port: parseInt(process.env.DB_PORT ?? "5432", 10),
    username: required("DB_USERNAME", "postgres"),
    password: required("DB_PASSWORD", "postgres"),
    name: required("DB_NAME", "aura_store"),
  },

  jwt: {
    secret: required("JWT_SECRET", "dev_only_insecure_secret"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  },

  logLevel: process.env.LOG_LEVEL ?? "info",

  isProduction: (process.env.NODE_ENV ?? "development") === "production",
};
