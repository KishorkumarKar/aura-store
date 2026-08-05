"use client";
import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/products?category=Furniture", label: "Furniture" },
      { href: "/products?category=Textiles", label: "Textiles" },
      { href: "/products?category=Decor", label: "Decor" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/", label: "Shipping & Returns" },
      { href: "/", label: "Care Guides" },
      { href: "/", label: "Contact Us" },
      { href: "/", label: "FAQ" },
    ],
  },
  {
    title: "Studio",
    links: [
      { href: "/", label: "Our Makers" },
      { href: "/", label: "Journal" },
      { href: "/", label: "Sustainability" },
      { href: "/", label: "Careers" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-sand">
      <div className="container-wrap grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <p className="font-display text-2xl">Aura</p>
          <p className="mt-3 max-w-xs text-sm text-sand/70">
            Considered objects for the home, made in small batches by
            independent makers we work with directly.
          </p>
          <form className="mt-6 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter"
              type="email"
              required
              placeholder="Your email"
              className="w-full border border-sand/25 bg-transparent px-3 py-2 text-sm placeholder:text-sand/40 focus:border-sand"
            />
            <button type="submit" className="shrink-0 border border-sand px-4 py-2 text-sm uppercase tracking-wide hover:bg-sand hover:text-ink transition-colors">
              Join
            </button>
          </form>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="text-sm uppercase tracking-wide text-sand/50">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-sand/80 hover:text-sand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-sand/10">
        <div className="container-wrap flex flex-col gap-2 py-5 text-xs text-sand/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Aura Home Goods Co.</p>
          <p>Prices shown in USD.</p>
        </div>
      </div>
    </footer>
  );
}
