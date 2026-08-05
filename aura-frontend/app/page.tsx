import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const CATEGORIES = [
  { name: "Furniture", image: "https://placehold.co/600x750/5B3A29/F6F3EC?text=Furniture" },
  { name: "Textiles", image: "https://placehold.co/600x750/7C8B6F/F6F3EC?text=Textiles" },
  { name: "Decor", image: "https://placehold.co/600x750/C9A227/22201C?text=Decor" },
  { name: "Tableware", image: "https://placehold.co/600x750/5B6168/F6F3EC?text=Tableware" },
];

export default function HomePage() {
  const featured = products.slice(0, 4);

  return (
    <>
      <HeroSlider />

      {/* Shop by category */}
      <section className="container-wrap py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl italic">Shop by room</h2>
          <Link href="/products" className="hidden text-sm uppercase tracking-wide text-ink/60 hover:text-ink sm:block">
            View everything →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative block aspect-[4/5] overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/20 transition-colors group-hover:bg-ink/35" />
              <span className="absolute bottom-4 left-4 font-display text-xl text-sand">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white/40 py-16">
        <div className="container-wrap">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl italic">Recently added</h2>
            <Link href="/products" className="hidden text-sm uppercase tracking-wide text-ink/60 hover:text-ink sm:block">
              Shop all →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Editorial / brand strip */}
      <section className="container-wrap grid gap-10 py-20 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src="https://placehold.co/900x675/22201C/F6F3EC?text=In+the+Workshop"
            alt="Maker at work in the studio"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink/50">
            Our approach
          </p>
          <h2 className="mt-4 font-display text-3xl italic leading-snug">
            We work with fourteen small workshops, not fourteen hundred.
          </h2>
          <p className="mt-4 max-w-md text-ink/70">
            Every piece in the shop is traceable to the person who made it.
            We place small orders, pay up front, and never ask a workshop to
            scale past what its hands can do well.
          </p>
          <Link href="/products" className="btn-secondary mt-8">
            Meet the collection
          </Link>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-line bg-forest text-sand">
        <div className="container-wrap grid grid-cols-1 gap-8 py-12 sm:grid-cols-3">
          {[
            { title: "Free shipping over $100", copy: "Flat $8 under that, anywhere in the US." },
            { title: "30-day returns", copy: "Unused items, original packaging." },
            { title: "Made to order", copy: "Most furniture ships in 2–4 weeks." },
          ].map((item) => (
            <div key={item.title}>
              <p className="font-display text-lg">{item.title}</p>
              <p className="mt-1 text-sm text-sand/70">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
