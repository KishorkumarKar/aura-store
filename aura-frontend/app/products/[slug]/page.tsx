import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, products } from "@/data/products";
import ProductGallery from "@/components/ProductGallery";
import ProductOptions from "@/components/ProductOptions";
import ProductCard from "@/components/ProductCard";

interface ProductDetailPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: ProductDetailPageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  return { title: `${product.name} — Aura` };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-wrap py-10">
      <nav className="mb-6 text-xs uppercase tracking-wide text-ink/50">
        <Link href="/products" className="hover:text-ink">
          Shop All
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-ink">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink/80">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">
            {product.category}
          </p>
          <h1 className="mt-2 font-display text-3xl italic">{product.name}</h1>
          <p className="mt-1 text-sm text-ink/60">
            {product.rating.toFixed(1)} ★ · {product.type === "configurable" ? "Configurable" : "Simple product"}
          </p>

          <p className="mt-5 max-w-md text-ink/70">{product.description}</p>

          <ProductOptions product={product} />

          <dl className="mt-10 space-y-2 border-t border-line pt-6 text-sm text-ink/60">
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>Free over $100, otherwise flat $8</dd>
            </div>
            <div className="flex justify-between">
              <dt>Returns</dt>
              <dd>30 days, unused condition</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl italic">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
