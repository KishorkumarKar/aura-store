"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/lib/types";

function lineKey(item: CartItem): string {
  return `${item.productId}::${item.variantKey}`;
}

export default function CartPage() {
  const { items, hydrated, updateQuantity, removeItem, subtotal, shipping, tax, total } =
    useCart();

  if (hydrated && items.length === 0) {
    return (
      <div className="container-wrap py-24 text-center">
        <h1 className="font-display text-3xl italic">Your cart is empty</h1>
        <p className="mt-3 text-ink/60">
          Nothing here yet — browse the shop to find something worth keeping.
        </p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Shop All
        </Link>
      </div>
    );
  }

  return (
    <div className="container-wrap py-10">
      <h1 className="font-display text-3xl italic">Your Cart</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-line border-y border-line">
          {items.map((item) => (
            <div key={lineKey(item)} className="flex gap-4 py-6">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-line">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-display text-lg hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.variantLabel && (
                      <p className="mt-1 text-sm text-ink/60">
                        {item.variantLabel}
                      </p>
                    )}
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-ink/20">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variantKey, item.quantity - 1)
                      }
                      className="px-3 py-1.5 text-lg leading-none hover:bg-line"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.variantKey, item.quantity + 1)
                      }
                      className="px-3 py-1.5 text-lg leading-none hover:bg-line"
                      aria-label={`Increase quantity of ${item.name}`}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId, item.variantKey)}
                    className="text-sm text-ink/50 underline underline-offset-4 hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit border border-line p-6">
          <h2 className="font-display text-xl">Order Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd>${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Estimated tax</dt>
              <dd>${tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-semibold">
              <dt>Total</dt>
              <dd>${total.toFixed(2)}</dd>
            </div>
          </dl>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Checkout
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm text-ink/60 underline underline-offset-4 hover:text-ink"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
