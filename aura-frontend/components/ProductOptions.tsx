"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { OptionType, Product } from "@/lib/types";

export default function ProductOptions({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const isConfigurable = product.type === "configurable";

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.type === "configurable") {
      product.optionTypes.forEach((type) => {
        initial[type] = "";
      });
    }
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const selectedVariant = useMemo(() => {
    if (product.type !== "configurable") return null;
    const allChosen = product.optionTypes.every((t) => selected[t]);
    if (!allChosen) return null;
    return product.variants.find((v) =>
      product.optionTypes.every((t) => v[t] === selected[t])
    );
  }, [product, selected]);

  const price =
    product.type === "configurable" ? selectedVariant?.price : product.price;
  const stock =
    product.type === "configurable" ? selectedVariant?.stock : product.stock;
  const canAdd = isConfigurable
    ? Boolean(selectedVariant) && (stock ?? 0) > 0
    : (stock ?? 0) > 0;

  function chooseOption(type: OptionType, value: string) {
    setSelected((prev) => ({ ...prev, [type]: value }));
    setAdded(false);
    setError("");
  }

  function handleAddToCart() {
    if (product.type === "configurable" && !selectedVariant) {
      setError("Please select all options before adding to cart.");
      return;
    }
    if (!stock || stock <= 0) {
      setError("This item is out of stock.");
      return;
    }

    const variantKey =
      product.type === "configurable"
        ? product.optionTypes.map((t) => selected[t]).join("/")
        : "default";

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      variantKey,
      variantLabel:
        product.type === "configurable"
          ? product.optionTypes.map((t) => selected[t]).join(" / ")
          : null,
      price: price as number,
      quantity,
      stock,
    });

    setError("");
    setAdded(true);
  }

  return (
    <div className="mt-6">
      <p className="font-display text-2xl">
        {price !== undefined ? `$${price}` : "Select options"}
      </p>

      {product.type === "configurable" &&
        product.optionTypes.map((type) => (
          <div key={type} className="mt-6">
            <h3 className="text-sm uppercase tracking-wide text-ink/50">
              {type}
              {selected[type] ? `: ${selected[type]}` : ""}
            </h3>

            {type === "color" ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.options.color?.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => chooseOption("color", c.value)}
                    aria-pressed={selected.color === c.value}
                    aria-label={c.value}
                    title={c.value}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${
                      selected.color === c.value
                        ? "border-forest scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {product.options.size?.map((value) => {
                  const isActive = selected[type] === value;
                  // Determine if this specific value has any stock given
                  // other currently-selected options.
                  const wouldBeOutOfStock = product.variants
                    .filter((v) =>
                      product.optionTypes
                        .filter((t) => t !== type && selected[t])
                        .every((t) => v[t] === selected[t])
                    )
                    .filter((v) => v[type] === value)
                    .every((v) => v.stock === 0);

                  return (
                    <button
                      key={value}
                      onClick={() => chooseOption(type, value)}
                      aria-pressed={isActive}
                      className={`border px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? "border-forest bg-forest text-sand"
                          : "border-ink/20 text-ink hover:border-ink"
                      } ${wouldBeOutOfStock ? "opacity-40" : ""}`}
                    >
                      {value}
                      {wouldBeOutOfStock ? " (out of stock)" : ""}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}

      {isConfigurable && selectedVariant && selectedVariant.stock === 0 && (
        <p className="mt-3 text-sm text-ink/60">
          That combination is out of stock.
        </p>
      )}
      {isConfigurable && selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3 && (
        <p className="mt-3 text-sm text-gold">
          Only {selectedVariant.stock} left.
        </p>
      )}
      {!isConfigurable && stock !== undefined && stock > 0 && stock <= 3 && (
        <p className="mt-3 text-sm text-gold">Only {stock} left.</p>
      )}

      <div className="mt-6 flex items-center gap-4">
        <div className="flex items-center border border-ink/20">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-lg leading-none hover:bg-line"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm" aria-live="polite">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(q + 1, stock || 99))}
            className="px-3 py-2 text-lg leading-none hover:bg-line"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!canAdd}
          className="btn-primary flex-1"
        >
          {stock === 0 && (!isConfigurable || selectedVariant)
            ? "Out of stock"
            : "Add to cart"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {added && !error && (
        <div className="mt-4 flex items-center justify-between border border-forest/30 bg-forest/5 px-4 py-3 text-sm">
          <span>Added to cart.</span>
          <button
            onClick={() => router.push("/cart")}
            className="font-semibold text-forest underline underline-offset-4"
          >
            View cart
          </button>
        </div>
      )}
    </div>
  );
}
