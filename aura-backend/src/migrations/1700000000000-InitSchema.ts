import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1700000000000 implements MigrationInterface {
  name = "InitSchema1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE "aura_users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "first_name" varchar(100) NOT NULL,
        "last_name" varchar(100) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_aura_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_aura_users_email" UNIQUE ("email")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "aura_revoked_tokens" (
        "jti" uuid NOT NULL,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "revoked_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_aura_revoked_tokens" PRIMARY KEY ("jti")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "aura_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "slug" varchar(100) NOT NULL,
        "image" varchar(500),
        "sort_order" int NOT NULL DEFAULT 0,
        CONSTRAINT "PK_aura_categories" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_aura_categories_slug" UNIQUE ("slug")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "aura_products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" varchar(200) NOT NULL,
        "name" varchar(200) NOT NULL,
        "description" text NOT NULL,
        "type" varchar(20) NOT NULL,
        "category_id" uuid NOT NULL,
        "price" numeric(10,2),
        "stock" int,
        "color" varchar(60),
        "color_hex" varchar(7),
        "rating" numeric(2,1) NOT NULL DEFAULT 0,
        "images" jsonb NOT NULL DEFAULT '[]',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_aura_products" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_aura_products_slug" UNIQUE ("slug"),
        CONSTRAINT "FK_aura_products_category" FOREIGN KEY ("category_id")
          REFERENCES "aura_categories" ("id") ON DELETE RESTRICT,
        CONSTRAINT "CHK_aura_products_type" CHECK ("type" IN ('simple', 'configurable'))
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "aura_product_variants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "product_id" uuid NOT NULL,
        "color" varchar(60),
        "color_hex" varchar(7),
        "size" varchar(30),
        "price" numeric(10,2) NOT NULL,
        "stock" int NOT NULL DEFAULT 0,
        "sku" varchar(60) NOT NULL,
        CONSTRAINT "PK_aura_product_variants" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_aura_product_variants_sku" UNIQUE ("sku"),
        CONSTRAINT "FK_aura_product_variants_product" FOREIGN KEY ("product_id")
          REFERENCES "aura_products" ("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "aura_banners" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "eyebrow" varchar(100) NOT NULL,
        "title" varchar(200) NOT NULL,
        "copy" text NOT NULL,
        "cta_href" varchar(200) NOT NULL,
        "cta_label" varchar(100) NOT NULL,
        "image" varchar(500) NOT NULL,
        "sort_order" int NOT NULL DEFAULT 0,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_aura_banners" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "aura_features" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar(150) NOT NULL,
        "copy" varchar(250) NOT NULL,
        "sort_order" int NOT NULL DEFAULT 0,
        CONSTRAINT "PK_aura_features" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "aura_cart_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "variant_id" uuid,
        "quantity" int NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_aura_cart_items" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_aura_cart_items_user_product_variant" UNIQUE ("user_id", "product_id", "variant_id"),
        CONSTRAINT "FK_aura_cart_items_user" FOREIGN KEY ("user_id")
          REFERENCES "aura_users" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_aura_cart_items_product" FOREIGN KEY ("product_id")
          REFERENCES "aura_products" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_aura_cart_items_variant" FOREIGN KEY ("variant_id")
          REFERENCES "aura_product_variants" ("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "aura_orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_number" varchar(20) NOT NULL,
        "user_id" uuid NOT NULL,
        "email" varchar(255) NOT NULL,
        "name" varchar(200) NOT NULL,
        "address" text NOT NULL,
        "subtotal" numeric(10,2) NOT NULL,
        "shipping" numeric(10,2) NOT NULL,
        "tax" numeric(10,2) NOT NULL,
        "total" numeric(10,2) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'paid',
        "placed_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_aura_orders" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_aura_orders_order_number" UNIQUE ("order_number"),
        CONSTRAINT "FK_aura_orders_user" FOREIGN KEY ("user_id")
          REFERENCES "aura_users" ("id") ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "aura_order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "variant_id" uuid,
        "product_name" varchar(200) NOT NULL,
        "variant_label" varchar(150),
        "image" varchar(500) NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "quantity" int NOT NULL,
        CONSTRAINT "PK_aura_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_aura_order_items_order" FOREIGN KEY ("order_id")
          REFERENCES "aura_orders" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_aura_order_items_product" FOREIGN KEY ("product_id")
          REFERENCES "aura_products" ("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_aura_order_items_variant" FOREIGN KEY ("variant_id")
          REFERENCES "aura_product_variants" ("id") ON DELETE RESTRICT
      );
    `);

    // Helpful lookup indexes beyond the unique constraints above.
    await queryRunner.query(`CREATE INDEX "IDX_aura_products_category_id" ON "aura_products" ("category_id");`);
    await queryRunner.query(`CREATE INDEX "IDX_aura_product_variants_product_id" ON "aura_product_variants" ("product_id");`);
    await queryRunner.query(`CREATE INDEX "IDX_aura_cart_items_user_id" ON "aura_cart_items" ("user_id");`);
    await queryRunner.query(`CREATE INDEX "IDX_aura_orders_user_id" ON "aura_orders" ("user_id");`);
    await queryRunner.query(`CREATE INDEX "IDX_aura_order_items_order_id" ON "aura_order_items" ("order_id");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_order_items";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_orders";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_cart_items";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_features";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_banners";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_product_variants";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_products";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_categories";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_revoked_tokens";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "aura_users";`);
  }
}
