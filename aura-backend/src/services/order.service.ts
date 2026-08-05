import { AppDataSource } from "../config/data-source";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { ProductVariant } from "../entities/ProductVariant";
import { Order, OrderItem } from "../entities/Order";
import { ApiError } from "../utils/ApiError";
import { computeTotals } from "../utils/pricing";
import { logger } from "../config/logger";
import { EntityManager } from "typeorm";

export interface PlaceOrderInput {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

function generateOrderNumber(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `AU-${suffix}`;
}

function serializeOrder(order: Order) {
  return {
    orderNumber: order.orderNumber,
    email: order.email,
    name: order.name,
    address: order.address,
    status: order.status,
    subtotal: Number(order.subtotal),
    shipping: Number(order.shipping),
    tax: Number(order.tax),
    total: Number(order.total),
    placedAt: order.placedAt,
    items: order.items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      name: i.productName,
      variantLabel: i.variantLabel,
      image: i.image,
      price: Number(i.price),
      quantity: i.quantity,
    })),
  };
}

export const orderService = {
  async placeOrder(userId: string, input: PlaceOrderInput) {
    return AppDataSource.transaction(async (manager: EntityManager) => {
      const cartRepo = manager.getRepository(CartItem);
      const cartItems = await cartRepo.find({
        where: { userId },
        relations: { product: true, variant: true },
      });

      if (cartItems.length === 0) {
        throw ApiError.badRequest("Your cart is empty");
      }

      // Re-validate stock inside the transaction to avoid races between
      // "view cart" and "place order".
      for (const item of cartItems) {
        const availableStock =
          item.product.type === "simple"
            ? item.product.stock ?? 0
            : item.variant?.stock ?? 0;
        if (item.quantity > availableStock) {
          throw ApiError.conflict(
            `"${item.product.name}" only has ${availableStock} left in stock — please update your cart.`
          );
        }
      }

      const lines = cartItems.map((item) => ({
        price:
          item.product.type === "simple"
            ? Number(item.product.price)
            : Number(item.variant?.price ?? 0),
        quantity: item.quantity,
      }));
      const totals = computeTotals(lines);

      const order = manager.getRepository(Order).create({
        orderNumber: generateOrderNumber(),
        userId,
        email: input.email,
        name: `${input.firstName} ${input.lastName}`,
        address: `${input.address}, ${input.city}, ${input.state} ${input.zip}`,
        subtotal: totals.subtotal.toFixed(2),
        shipping: totals.shipping.toFixed(2),
        tax: totals.tax.toFixed(2),
        total: totals.total.toFixed(2),
        status: "paid",
        items: cartItems.map((item) => {
          const price =
            item.product.type === "simple"
              ? Number(item.product.price)
              : Number(item.variant?.price ?? 0);
          const variantLabel = item.variant
            ? [item.variant.color, item.variant.size].filter(Boolean).join(" / ")
            : null;

          return manager.getRepository(OrderItem).create({
            productId: item.productId,
            variantId: item.variantId,
            productName: item.product.name,
            variantLabel,
            image: item.product.images[0] ?? "",
            price: price.toFixed(2),
            quantity: item.quantity,
          });
        }),
      });

      await manager.getRepository(Order).save(order);

      // Decrement stock.
      for (const item of cartItems) {
        if (item.product.type === "simple") {
          await manager
            .getRepository(Product)
            .decrement({ id: item.productId }, "stock", item.quantity);
        } else if (item.variantId) {
          await manager
            .getRepository(ProductVariant)
            .decrement({ id: item.variantId }, "stock", item.quantity);
        }
      }

      await cartRepo.delete({ userId });

      logger.info("order placed", { userId, orderNumber: order.orderNumber });

      return serializeOrder(order);
    });
  },

  async getByOrderNumber(userId: string, orderNumber: string) {
    const repo = AppDataSource.getRepository(Order);
    const order = await repo.findOne({ where: { orderNumber, userId } });
    if (!order) throw ApiError.notFound("Order not found");
    return serializeOrder(order);
  },

  async listForUser(userId: string) {
    const repo = AppDataSource.getRepository(Order);
    const orders = await repo.find({
      where: { userId },
      order: { placedAt: "DESC" },
    });
    return orders.map(serializeOrder);
  },
};
