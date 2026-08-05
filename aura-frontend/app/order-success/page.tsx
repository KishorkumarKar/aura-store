"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { PlacedOrder } from "@/lib/types";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("aura-last-order");
      if (raw) setOrder(JSON.parse(raw) as PlacedOrder);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="container-wrap py-20">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-forest text-sand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-6 font-display text-3xl italic">Order confirmed</h1>
        <p className="mt-3 text-ink/60">
          Thank you{order?.name ? `, ${order.name}` : ""} — a confirmation
          has been sent to {order?.email || "your email"}.
        </p>
        <p className="mt-1 text-sm text-ink/50">
          Order number: <span className="font-medium text-ink">{orderNumber || order?.orderNumber || "—"}</span>
        </p>
      </div>

      {order && (
        <div className="mx-auto mt-10 max-w-xl border border-line p-6">
          <h2 className="font-display text-xl">What you ordered</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {order.items.map((item) => (
              <li key={`${item.productId}::${item.variantKey}`} className="flex justify-between gap-2">
                <span className="text-ink/70">
                  {item.name}
                  {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd>${order.subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Shipping</dt>
              <dd>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Tax</dt>
              <dd>${order.tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 font-semibold">
              <dt>Total</dt>
              <dd>${order.total.toFixed(2)}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm text-ink/60">Shipping to: {order.address}</p>
        </div>
      )}

      <div className="mx-auto mt-10 flex max-w-xl justify-center gap-4">
        <Link href="/products" className="btn-primary">
          Continue shopping
        </Link>
        <Link href="/" className="btn-secondary">
          Back home
        </Link>
      </div>
    </div>
  );
}
