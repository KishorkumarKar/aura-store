import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/User";
import { RevokedToken } from "../entities/RevokedToken";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";
import { Banner } from "../entities/Banner";
import { Feature } from "../entities/Feature";
import { CartItem } from "../entities/CartItem";
import { Order, OrderItem } from "../entities/Order";
import { AuraNamingStrategy } from "@/database/AuraNamingStrategy";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  ssl: {
    rejectUnauthorized: false,
  },

  // Migrations are the source of truth for schema changes — never use
  // synchronize in an environment with data you care about.
  synchronize: false,
  logging: env.isProduction ? ["error", "warn"] : ["error", "warn", "schema"],

  entities: [
    User,
    RevokedToken,
    Category,
    Product,
    ProductVariant,
    Banner,
    Feature,
    CartItem,
    Order,
    OrderItem,
  ],
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
  migrationsTableName: "migrations",
  namingStrategy: new AuraNamingStrategy(),
});
