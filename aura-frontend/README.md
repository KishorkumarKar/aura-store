# Aura — Next.js Store Demo

A small e-commerce demo built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

Shared types (`Product`, `SimpleProduct`, `ConfigurableProduct`, `CartItem`, `PlacedOrder`, `PriceBucket`) live in `lib/types.ts`.

## Pages

- `/` — Home: hero slider, shop-by-category, featured products, brand story, trust strip.
- `/products` — Product listing with a left-hand filter sidebar (category, color, price, in-stock) synced to the URL query string, so filtered views are shareable/bookmarkable.
- `/products/[slug]` — Product detail. Handles both **simple** products (fixed price/stock) and **configurable** products (color/size options resolving to a specific variant, price, and stock).
- `/cart` — Cart with quantity steppers, line removal, and an order summary.
- `/checkout` — Shipping + payment form (client-side validated; no real payment is processed) with a live order summary.
- `/order-success` — Confirmation page showing the order number and a recap of what was ordered.

## Stack / structure

- `data/products.js` — mock product catalog (10 products, mix of simple/configurable).
- `context/CartContext.js` — cart state via React Context, persisted to `localStorage`.
- `components/` — `Header`, `Footer`, `HeroSlider`, `ProductCard`, `Filters`, `ProductGallery`, `ProductOptions`.
- Cart → Checkout → Success flow passes the placed order through `sessionStorage` so the success page can render a receipt after `clearCart()` empties the cart context.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Notes / things you'll likely want to change

- Product images are placeholder URLs from `placehold.co` — swap `data/products.js` for your real catalog/API.
- Checkout is a mock: it validates the form shape but doesn't call a payment provider.
- Tax/shipping logic in `CartContext.js` (`flat $8 under $100`, `7% tax`) is illustrative — replace with real rates or an API call.
- No auth/persistence beyond the browser — there's no backend here yet.
