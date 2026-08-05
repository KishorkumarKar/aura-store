# Aura Backend

Node.js + TypeScript API for the Aura store — Express, TypeORM (Postgres), Joi validation, Winston logging, JWT auth.

## Stack

- **Runtime**: Node.js + TypeScript (strict mode)
- **Framework**: Express
- **ORM / DB**: TypeORM + PostgreSQL
- **Validation**: Joi (request body/query/params)
- **Logging**: Winston (console + `logs/error.log` + `logs/combined.log`)
- **Auth**: JWT (Bearer tokens), bcrypt password hashing, DB-backed logout blacklist

## Project layout

```
src/
  config/        env, winston logger, TypeORM DataSource
  entities/      TypeORM entities (User, Product, ProductVariant, Category,
                 Banner, Feature, CartItem, Order/OrderItem, RevokedToken)
  migrations/    schema + seed-data migrations
  middlewares/   auth (JWT), Joi validate(), error handler, request logger
  validations/   Joi schemas per domain
  services/      business logic (one per domain)
  controllers/   thin HTTP layer, calls services
  routes/        Express routers
  utils/         ApiError, response helper, asyncHandler, jwt, pricing
  app.ts         Express app assembly
  server.ts      bootstrap (DB connect -> listen)
```

## Setup

```bash
npm install
cp .env.example .env   # then edit DB credentials / JWT secret
```

Create the database (name must match `DB_NAME` in `.env`):

```bash
createdb aura_store
```

Run migrations (schema, then seed data):

```bash
npm run migration:run
```

This seeds:
- 5 categories, 10 products (mix of simple/configurable, ported from the frontend's `data/products.ts`) with their variants
- 3 homepage banners, 3 homepage "features" (trust strip)
- 1 demo user — `demo@aura.test` / `Passw0rd!` — so you can log in immediately without registering

Start the dev server:

```bash
npm run dev
```

API is at `http://localhost:4000`. Health check: `GET /health`.

## Migration commands

```bash
npm run migration:run       # apply pending migrations
npm run migration:revert    # roll back the last migration
npm run migration:show      # list applied/pending migrations
npm run migration:generate -- src/migrations/SomeName   # diff entities -> new migration
```

`synchronize` is intentionally **off** — migrations are the only way schema changes reach the database.

## Auth model

- `POST /api/auth/register` and `/login` return `{ user, token }`. Send the token as `Authorization: Bearer <token>` on subsequent requests.
- JWTs are stateless and carry a `jti` (token id). `POST /api/auth/logout` inserts that `jti` into `revoked_tokens`; `requireAuth` checks every incoming token against that table, so a logged-out token stops working immediately even though the JWT itself is still technically valid until it expires.
- Nothing in `revoked_tokens` is ever cleaned up automatically — in a real deployment, add a scheduled job (cron / `pg_cron`) that deletes rows where `expires_at < now()`.
- Cart and order endpoints require auth. There is no guest cart in this API — if you want guest checkout, that's a reasonable next addition (e.g. a `X-Guest-Id` header identifying an anonymous cart, merged into the user's cart on login).

## API reference

All responses are `{ success: true, data, meta? }` or `{ success: false, message, errors? }`.

### Auth
| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/register` | – | `firstName, lastName, email, password` |
| POST | `/api/auth/login` | – | `email, password` |
| POST | `/api/auth/logout` | ✓ | – |
| GET | `/api/auth/me` | ✓ | – |

### Home / catalog browsing
| Method | Path | Notes |
|---|---|---|
| GET | `/api/home` | Aggregate: `{ banners, categories, features, featuredProducts }` |
| GET | `/api/banners` | Active hero slider banners |
| GET | `/api/categories` | Category list (also used for PLP filter sidebar) |
| GET | `/api/features` | Homepage trust-strip items |

### Products
| Method | Path | Notes |
|---|---|---|
| GET | `/api/products` | Query: `category, color, price, inStock, search, page, limit, sort`. `color`/`price` are comma-separated (`price` uses bucket ids `0-25,25-50,50-100,100-250,250-999999`). `sort`: `newest\|price_asc\|price_desc\|rating`. |
| GET | `/api/products/:slug` | Full detail incl. `variants`, `options`, plus up to 4 related products |

### Cart (auth required)
| Method | Path | Body |
|---|---|---|
| GET | `/api/cart` | – |
| POST | `/api/cart` | `productId, variantId? (required if product is configurable), quantity` |
| PATCH | `/api/cart/:itemId` | `quantity` |
| DELETE | `/api/cart/:itemId` | – |
| DELETE | `/api/cart` | clears the whole cart |

### Orders (auth required)
| Method | Path | Body |
|---|---|---|
| POST | `/api/orders` | `email, firstName, lastName, address, city, state, zip, cardNumber, expiry, cvc` (payment fields are format-validated only — never stored, no real processor is called) |
| GET | `/api/orders` | list current user's past orders |
| GET | `/api/orders/:orderNumber` | single order detail |

Placing an order runs inside a DB transaction: re-checks stock, snapshots each cart line into `order_items` (so later product edits never change historical orders), decrements `product`/`product_variant` stock, and clears the cart.

## Design notes / things you may want to change

- **Pricing math** (`src/utils/pricing.ts`) mirrors the frontend demo: free shipping ≥ $100, otherwise flat $8, 7% flat tax. Swap for real rate/shipping logic (or an external API) when you're ready.
- **Product listing filters** use `EXISTS` subqueries rather than joining the `product_variants` table, specifically so that `ORDER BY` on the computed price expression doesn't collide with `SELECT DISTINCT` (Postgres requires `DISTINCT` queries' `ORDER BY` expressions to appear in the select list — joining variants would have fanned out rows and forced that DISTINCT).
- **Stock decrement on order placement** does not currently guard against concurrent orders racing on the exact same variant between the transaction's initial stock check and the `decrement()` call. For a demo this is fine; for production, add `SELECT ... FOR UPDATE` locking on the rows being decremented or a `CHECK (stock >= 0)` constraint plus retry-on-conflict.
- **No refresh tokens** — access tokens live for `JWT_EXPIRES_IN` (default 1 day) and that's it. Add a refresh-token flow if you need longer sessions without re-login.
- **No rate limiting** on auth routes — add `express-rate-limit` (or similar) in front of `/api/auth/login` before shipping this for real.
