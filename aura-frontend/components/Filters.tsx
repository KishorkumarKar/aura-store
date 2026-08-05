"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { getAllColors } from "@/data/products";
import type { PriceBucket } from "@/lib/types";
import { PRICE_BUCKETS, CATEGORIES } from "@/lib/filter-data";

// export const PRICE_BUCKETS = PRICE_BUCKETS_DATA;

// const CATEGORIES = ["Furniture", "Textiles", "Decor", "Tableware", "Lighting"];

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export default function Filters({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeColors =
    searchParams.get("color")?.split(",").filter(Boolean) || [];
  const activePrices =
    searchParams.get("price")?.split(",").filter(Boolean) || [];
  const activeCategory = searchParams.get("category") || "";
  const inStockOnly = searchParams.get("inStock") === "1";

  const colors = getAllColors();

  function updateParams(mutator: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutator(params);
    router.push(`/products?${params.toString()}`, { scroll: false });
  }

  function onColorToggle(value: string) {
    updateParams((params) => {
      const next = toggleInList(activeColors, value);
      next.length
        ? params.set("color", next.join(","))
        : params.delete("color");
    });
  }

  function onPriceToggle(id: string) {
    updateParams((params) => {
      const next = toggleInList(activePrices, id);
      next.length
        ? params.set("price", next.join(","))
        : params.delete("price");
    });
  }

  function onCategoryChange(value: string) {
    updateParams((params) => {
      value ? params.set("category", value) : params.delete("category");
    });
  }

  function onInStockChange(checked: boolean) {
    updateParams((params) => {
      checked ? params.set("inStock", "1") : params.delete("inStock");
    });
  }

  function clearAll() {
    router.push("/products", { scroll: false });
  }

  const hasActiveFilters = Boolean(
    activeColors.length || activePrices.length || activeCategory || inStockOnly,
  );

  const body = (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm uppercase tracking-wide text-ink/50">
          Category
        </h3>
        <ul className="mt-3 space-y-2">
          <li>
            <button
              onClick={() => onCategoryChange("")}
              className={`text-sm ${!activeCategory ? "font-semibold text-ink" : "text-ink/70 hover:text-ink"}`}
            >
              All
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                onClick={() => onCategoryChange(cat)}
                className={`text-sm ${activeCategory === cat ? "font-semibold text-ink" : "text-ink/70 hover:text-ink"}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm uppercase tracking-wide text-ink/50">Color</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {colors.map((c) => {
            const active = activeColors.includes(c.value);
            return (
              <button
                key={c.value}
                onClick={() => onColorToggle(c.value)}
                title={c.value}
                aria-pressed={active}
                aria-label={c.value}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  active ? "border-forest scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
        {activeColors.length > 0 && (
          <p className="mt-2 text-xs text-ink/50">{activeColors.join(", ")}</p>
        )}
      </div>

      <div>
        <h3 className="text-sm uppercase tracking-wide text-ink/50">Price</h3>
        <ul className="mt-3 space-y-2">
          {PRICE_BUCKETS.map((bucket) => (
            <li key={bucket.id} className="flex items-center gap-2">
              <input
                id={`price-${bucket.id}`}
                type="checkbox"
                checked={activePrices.includes(bucket.id)}
                onChange={() => onPriceToggle(bucket.id)}
                className="h-4 w-4 accent-forest"
              />
              <label
                htmlFor={`price-${bucket.id}`}
                className="text-sm text-ink/70"
              >
                {bucket.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <input
            id="in-stock"
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="h-4 w-4 accent-forest"
          />
          <label htmlFor="in-stock" className="text-sm text-ink/70">
            In stock only
          </label>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="text-sm uppercase tracking-wide text-forest underline underline-offset-4"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="btn-secondary py-2"
          aria-expanded={mobileOpen}
        >
          Filters {hasActiveFilters ? "•" : ""}
        </button>
        <p className="text-sm text-ink/60">{resultCount} results</p>
      </div>
      {mobileOpen && <div className="mb-8 lg:hidden">{body}</div>}

      {/* Desktop sidebar */}
      <aside className="hidden w-full shrink-0 lg:block lg:w-56">{body}</aside>
    </>
  );
}
