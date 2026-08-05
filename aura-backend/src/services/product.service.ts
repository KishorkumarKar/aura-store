import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";
import { ApiError } from "../utils/ApiError";

export const PRICE_BUCKETS: Record<string, { min: number; max: number }> = {
  "0-25": { min: 0, max: 25 },
  "25-50": { min: 25, max: 50 },
  "50-100": { min: 50, max: 100 },
  "100-250": { min: 100, max: 250 },
  "250-999999": { min: 250, max: Infinity },
};

// For simple products, price lives on the product row. For configurable
// products, use the min variant price as the representative price for
// sorting/filtering. Self-contained correlated subquery — no join needed.
const PRICE_EXPR = `COALESCE(product.price, (SELECT MIN(v.price) FROM aura_product_variants v WHERE v.product_id = product.id))`;

export interface ListProductsInput {
  category?: string;
  color?: string;
  price?: string;
  inStock?: boolean;
  search?: string;
  page: number;
  limit: number;
  sort: "newest" | "price_asc" | "price_desc" | "rating";
}

export const productService = {
  async list(input: ListProductsInput) {
    const repo = AppDataSource.getRepository(Product);

    // Deliberately joins on category only, and uses EXISTS subqueries
    // (rather than leftJoinAndSelect on variants) for anything that could
    // match more than one variant row — that avoids fanning product rows
    // out per matching variant, which would otherwise force a DISTINCT
    // that Postgres can't combine with ORDER BY on a raw price expression.
    const qb = repo
      .createQueryBuilder("product")
      .leftJoin("product.category", "category")
      .select("product.id", "id");

    if (input.category) {
      qb.andWhere("(category.slug = :category OR category.name = :category)", {
        category: input.category,
      });
    }

    if (input.search) {
      qb.andWhere("product.name ILIKE :search", {
        search: `%${input.search}%`,
      });
    }

    if (input.color) {
      const colors = input.color.split(",").filter(Boolean);
      if (colors.length) {
        qb.andWhere(
          `(product.color IN (:...colors) OR EXISTS (
             SELECT 1 FROM aura_product_variants v
             WHERE v.product_id = product.id AND v.color IN (:...colors)
           ))`,
          { colors },
        );
      }
    }

    if (input.price) {
      const bucketIds = input.price.split(",").filter(Boolean);
      const ranges = bucketIds.map((id) => PRICE_BUCKETS[id]).filter(Boolean);
      if (ranges.length) {
        const clauses: string[] = [];
        const params: Record<string, number> = {};
        ranges.forEach((range, i) => {
          clauses.push(`(${PRICE_EXPR}) BETWEEN :min${i} AND :max${i}`);
          params[`min${i}`] = range.min;
          params[`max${i}`] = range.max === Infinity ? 999999999 : range.max;
        });
        qb.andWhere(`(${clauses.join(" OR ")})`, params);
      }
    }

    if (input.inStock) {
      qb.andWhere(
        `((product.type = 'simple' AND product.stock > 0) OR
          (product.type = 'configurable' AND EXISTS (
            SELECT 1 FROM aura_product_variants v
            WHERE v.product_id = product.id AND v.stock > 0
          )))`,
      );
    }

    // Count before pagination/order is applied.
    const total = await qb.getCount();

    switch (input.sort) {
      case "price_asc":
        qb.orderBy(PRICE_EXPR, "ASC");
        break;
      case "price_desc":
        qb.orderBy(PRICE_EXPR, "DESC");
        break;
      case "rating":
        qb.orderBy("product.rating", "DESC");
        break;
      default:
        qb.orderBy("product.createdAt", "DESC");
    }

    qb.offset((input.page - 1) * input.limit);
    qb.limit(input.limit);

    const rows = await qb.getRawMany<{ id: string }>();
    const ids = rows.map((r) => r.id);

    if (ids.length === 0) {
      return {
        products: [],
        meta: { page: input.page, limit: input.limit, total },
      };
    }

    // Fetch full entities (with relations) for just this page of ids, then
    // restore the order decided above — repo.find() with In() does not
    // guarantee result order.
    const products = await repo.find({
      where: { id: In(ids) },
      relations: { category: true, variants: true },
    });
    const byId = new Map(products.map((p) => [p.id, p]));
    const ordered = ids
      .map((id) => byId.get(id))
      .filter((p): p is Product => Boolean(p));

    return {
      products: ordered.map(serializeProduct),
      meta: { page: input.page, limit: input.limit, total },
    };
  },

  async getBySlug(slug: string) {
    const repo = AppDataSource.getRepository(Product);
    const product = await repo.findOne({
      where: { slug },
      relations: { category: true, variants: true },
    });
    if (!product) throw ApiError.notFound("Product not found");

    const related = await repo.find({
      where: { category: { id: product.categoryId } },
      relations: { category: true, variants: true },
      take: 5,
    });

    return {
      product: serializeProductDetail(product),
      related: related
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
        .map(serializeProduct),
    };
  },

  async listCategories() {
    const repo = AppDataSource.getRepository(Category);
    return repo.find({ order: { sortOrder: "ASC" } });
  },
};

function optionTypesFor(product: Product): ("color" | "size")[] {
  if (product.type !== "configurable") return [];
  const types: ("color" | "size")[] = [];
  if (product.variants.some((v) => v.color)) types.push("color");
  if (product.variants.some((v) => v.size)) types.push("size");
  return types;
}

function optionsFor(product: Product) {
  if (product.type !== "configurable") return undefined;
  const colorMap = new Map<string, string>();
  const sizes = new Set<string>();
  product.variants.forEach((v) => {
    if (v.color) colorMap.set(v.color, v.colorHex ?? "#000000");
    if (v.size) sizes.add(v.size);
  });
  return {
    color: colorMap.size
      ? Array.from(colorMap, ([value, hex]) => ({ value, hex }))
      : undefined,
    size: sizes.size ? Array.from(sizes) : undefined,
  };
}

function priceRangeFor(product: Product): [number, number] {
  if (product.type === "simple") {
    const p = Number(product.price);
    return [p, p];
  }
  const prices = product.variants.map((v) => Number(v.price));
  return [Math.min(...prices), Math.max(...prices)];
}

export function serializeProduct(product: Product) {
  const [minPrice, maxPrice] = priceRangeFor(product);
  const outOfStock =
    product.type === "simple"
      ? (product.stock ?? 0) === 0
      : product.variants.every((v) => v.stock === 0);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category?.name,
    type: product.type,
    color: product.color,
    rating: Number(product.rating),
    images: product.images,
    minPrice,
    maxPrice,
    outOfStock,
  };
}

function serializeProductDetail(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    category: product.category?.name,
    type: product.type,
    color: product.color,
    colorHex: product.colorHex,
    rating: Number(product.rating),
    images: product.images,
    price: product.type === "simple" ? Number(product.price) : undefined,
    stock: product.type === "simple" ? product.stock : undefined,
    optionTypes: optionTypesFor(product),
    options: optionsFor(product),
    variants:
      product.type === "configurable"
        ? product.variants.map((v) => ({
            id: v.id,
            color: v.color,
            size: v.size,
            price: Number(v.price),
            stock: v.stock,
            sku: v.sku,
          }))
        : undefined,
  };
}
