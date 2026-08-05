"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/products", label: "Shop All" },
  { href: "/products?category=Furniture", label: "Furniture" },
  { href: "/products?category=Textiles", label: "Textiles" },
  { href: "/products?category=Decor", label: "Decor" },
];

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-sand/95 backdrop-blur">
      <div className="container-wrap flex h-16 items-center justify-between">
        <button
          className="md:hidden text-sm"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="block w-6 space-y-1.5">
            <span className="block h-px w-full bg-ink" />
            <span className="block h-px w-full bg-ink" />
            <span className="block h-px w-full bg-ink" />
          </span>
        </button>

        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-ink"
        >
          Aura
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm uppercase tracking-wide text-ink/70 hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative flex items-center gap-2 text-sm uppercase tracking-wide"
          aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="20" r="1.4" fill="currentColor" />
            <circle cx="17" cy="20" r="1.4" fill="currentColor" />
          </svg>
          <span className="hidden sm:inline">Cart</span>
          {count > 0 && (
            <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[11px] text-sand">
              {count}
            </span>
          )}
        </Link>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-line bg-sand">
          <ul className="container-wrap flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block py-3 text-sm uppercase tracking-wide"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
