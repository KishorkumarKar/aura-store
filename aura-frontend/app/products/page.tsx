// "use client";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import Filters from "@/components/Filters";
import { PRICE_BUCKETS } from "@/lib/filter-data";
import { products, getPriceRange } from "@/data/products";
import type { Product } from "@/lib/types";

export const metadata: Metadata = {
  title: "Shop All — Aura",
};

function matchesColor(product: Product, colors: string[]): boolean {
  if (!colors.length) return true;
  if (product.type === "simple") return colors.includes(product.color);
  return product.options.color?.some((c) => colors.includes(c.value)) ?? false;
}

function matchesPrice(product: Product, bucketIds: string[]): boolean {
  if (!bucketIds.length) return true;
  const [min, max] = getPriceRange(product);
  return bucketIds.some((id) => {
    const bucket = PRICE_BUCKETS.find((b) => b.id === id);
    if (!bucket) return false;
    return min <= bucket.max && max >= bucket.min;
  });
}

function matchesCategory(product: Product, category: string): boolean {
  if (!category) return true;
  return product.category === category;
}

function matchesStock(product: Product, inStockOnly: boolean): boolean {
  if (!inStockOnly) return true;
  return product.type === "simple"
    ? product.stock > 0
    : product.variants.some((v) => v.stock > 0);
}

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const colorParam = typeof searchParams.color === "string" ? searchParams.color : "";
  const priceParam = typeof searchParams.price === "string" ? searchParams.price : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const inStockOnly = searchParams.inStock === "1";

  const colors = colorParam.split(",").filter(Boolean);
  const prices = priceParam.split(",").filter(Boolean);

  const filtered = products.filter(
    (p) =>
      matchesColor(p, colors) &&
      matchesPrice(p, prices) &&
      matchesCategory(p, category) &&
      matchesStock(p, inStockOnly)
  );

  return (
    <div className="container-wrap py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl italic">
          {category || "Shop All"}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <Filters resultCount={filtered.length} />

        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="border border-line py-20 text-center">
              <p className="font-display text-xl italic">No matches here</p>
              <p className="mt-2 text-sm text-ink/60">
                Try clearing a filter — nothing in the shop fits all of these
                at once.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
