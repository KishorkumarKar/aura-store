import { AppDataSource } from "../config/data-source";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { ApiError } from "../utils/ApiError";
import { computeTotals } from "../utils/pricing";
import { IsNull } from "typeorm";

function serializeCartItem(item: CartItem) {
  const price =
    item.product.type === "simple"
      ? Number(item.product.price)
      : Number(item.variant?.price ?? 0);
  const stock =
    item.product.type === "simple"
      ? item.product.stock ?? 0
      : item.variant?.stock ?? 0;
  const variantLabel = item.variant
    ? [item.variant.color, item.variant.size].filter(Boolean).join(" / ")
    : null;

  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    slug: item.product.slug,
    name: item.product.name,
    image: item.product.images[0] ?? null,
    variantLabel,
    price,
    quantity: item.quantity,
    stock,
    lineTotal: Number((price * item.quantity).toFixed(2)),
  };
}

async function resolvePriceAndStock(productId: string, variantId?: string | null) {
  const productRepo = AppDataSource.getRepository(Product);
  const product = await productRepo.findOne({
    where: { id: productId },
    relations: { variants: true },
  });
  if (!product) throw ApiError.notFound("Product not found");

  if (product.type === "simple") {
    return { product, variant: null, price: Number(product.price), stock: product.stock ?? 0 };
  }

  if (!variantId) {
    throw ApiError.badRequest("This product requires a variant selection");
  }
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) throw ApiError.badRequest("Selected variant does not exist for this product");

  return { product, variant, price: Number(variant.price), stock: variant.stock };
}

export const cartService = {
  async getCart(userId: string) {
    const repo = AppDataSource.getRepository(CartItem);
    const items = await repo.find({
      where: { userId },
      order: { createdAt: "ASC" },
    });
    const serialized = items.map(serializeCartItem);
    const totals = computeTotals(serialized);
    return { items: serialized, ...totals };
  },

  async addItem(userId: string, input: { productId: string; variantId?: string | null; quantity: number }) {
    const { product, variant, stock } = await resolvePriceAndStock(
      input.productId,
      input.variantId
    );

    if (stock <= 0) {
      throw ApiError.badRequest("This item is out of stock");
    }

    const repo = AppDataSource.getRepository(CartItem);

    // Postgres treats NULL != NULL, so a plain unique constraint on
    // (userId, productId, variantId) won't catch duplicate "simple"
    // product rows (variantId is null) — look up manually instead.
    const existing = await repo.findOne({
      where: {
        userId,
        productId: input.productId,
        variantId: input.variantId ?? IsNull(),
      },
    });

    const desiredQuantity = (existing?.quantity ?? 0) + input.quantity;
    if (desiredQuantity > stock) {
      throw ApiError.badRequest(`Only ${stock} left in stock`);
    }

    if (existing) {
      existing.quantity = desiredQuantity;
      await repo.save(existing);
    } else {
      const item = repo.create({
        userId,
        productId: input.productId,
        variantId: input.variantId ?? null,
        quantity: input.quantity,
      });
      await repo.save(item);
    }

    return this.getCart(userId);
  },

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    const repo = AppDataSource.getRepository(CartItem);
    const item = await repo.findOne({ where: { id: itemId, userId } });
    if (!item) throw ApiError.notFound("Cart item not found");

    const { stock } = await resolvePriceAndStock(item.productId, item.variantId);
    if (quantity > stock) {
      throw ApiError.badRequest(`Only ${stock} left in stock`);
    }

    item.quantity = quantity;
    await repo.save(item);
    return this.getCart(userId);
  },

  async removeItem(userId: string, itemId: string) {
    const repo = AppDataSource.getRepository(CartItem);
    const result = await repo.delete({ id: itemId, userId });
    if (!result.affected) throw ApiError.notFound("Cart item not found");
    return this.getCart(userId);
  },

  async clearCart(userId: string) {
    const repo = AppDataSource.getRepository(CartItem);
    await repo.delete({ userId });
  },
};

export { serializeCartItem };
