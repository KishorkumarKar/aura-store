import Link from "next/link";
import Image from "next/image";
import { getDisplayPrice } from "@/data/products";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock =
    product.type === "simple"
      ? product.stock === 0
      : product.variants.every((v) => v.stock === 0);

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-line">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {outOfStock && (
          <span className="absolute left-3 top-3 bg-ink px-2 py-1 text-[11px] uppercase tracking-wide text-sand">
            Sold out
          </span>
        )}
        {product.type === "configurable" && !outOfStock && (
          <span className="absolute left-3 top-3 bg-sand px-2 py-1 text-[11px] uppercase tracking-wide text-ink">
            Configurable
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs uppercase tracking-wide text-ink/50">
          {product.category}
        </p>
        <h3 className="mt-1 font-display text-lg leading-snug">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-ink/70">{getDisplayPrice(product)}</p>
      </div>
    </Link>
  );
}
