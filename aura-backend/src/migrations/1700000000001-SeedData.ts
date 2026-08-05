import { MigrationInterface, QueryRunner } from "typeorm";
import bcrypt from "bcryptjs";

interface SeedCategory {
  name: string;
  slug: string;
  image: string;
  sortOrder: number;
}

interface SeedVariant {
  color?: string;
  colorHex?: string;
  size?: string;
  price: number;
  stock: number;
  sku: string;
}

interface SeedSimpleProduct {
  slug: string;
  name: string;
  categorySlug: string;
  type: "simple";
  price: number;
  stock: number;
  color: string;
  colorHex: string;
  rating: number;
  description: string;
  images: string[];
}

interface SeedConfigurableProduct {
  slug: string;
  name: string;
  categorySlug: string;
  type: "configurable";
  rating: number;
  description: string;
  images: string[];
  variants: SeedVariant[];
}

type SeedProduct = SeedSimpleProduct | SeedConfigurableProduct;

function img(seed: string, w = 800, h = 900): string {
  return `https://placehold.co/${w}x${h}/EDE8DB/22201C?text=${encodeURIComponent(seed)}`;
}

const CATEGORIES: SeedCategory[] = [
  { name: "Furniture", slug: "furniture", image: "https://placehold.co/600x750/5B3A29/F6F3EC?text=Furniture", sortOrder: 1 },
  { name: "Textiles", slug: "textiles", image: "https://placehold.co/600x750/7C8B6F/F6F3EC?text=Textiles", sortOrder: 2 },
  { name: "Decor", slug: "decor", image: "https://placehold.co/600x750/C9A227/22201C?text=Decor", sortOrder: 3 },
  { name: "Tableware", slug: "tableware", image: "https://placehold.co/600x750/5B6168/F6F3EC?text=Tableware", sortOrder: 4 },
  { name: "Lighting", slug: "lighting", image: "https://placehold.co/600x750/B5651D/F6F3EC?text=Lighting", sortOrder: 5 },
];

// Ported 1:1 from the frontend's data/products.ts mock catalog.
const PRODUCTS: SeedProduct[] = [
  {
    slug: "clay-table-lamp",
    name: "Clay Table Lamp",
    categorySlug: "lighting",
    type: "simple",
    price: 68,
    stock: 14,
    color: "Terracotta",
    colorHex: "#B5651D",
    rating: 4.6,
    description:
      "A hand-thrown ceramic lamp base with a linen shade. Every piece is finished by a different potter, so subtle variations in glaze are part of the design, not a flaw.",
    images: [img("Clay Lamp 1"), img("Clay Lamp 2"), img("Clay Lamp 3")],
  },
  {
    slug: "linen-throw-pillow",
    name: "Linen Throw Pillow",
    categorySlug: "textiles",
    type: "configurable",
    rating: 4.8,
    description:
      "Stonewashed linen cover over a feather-down insert. Choose a colorway and a size to match your room.",
    images: [img("Linen Pillow 1"), img("Linen Pillow 2")],
    variants: [
      { color: "Sage", colorHex: "#7C8B6F", size: "18x18", price: 42, stock: 9, sku: "PIL-SAG-18" },
      { color: "Sage", colorHex: "#7C8B6F", size: "20x20", price: 46, stock: 6, sku: "PIL-SAG-20" },
      { color: "Sage", colorHex: "#7C8B6F", size: "24x24", price: 52, stock: 0, sku: "PIL-SAG-24" },
      { color: "Sand", colorHex: "#D8CBAE", size: "18x18", price: 42, stock: 11, sku: "PIL-SAN-18" },
      { color: "Sand", colorHex: "#D8CBAE", size: "20x20", price: 46, stock: 8, sku: "PIL-SAN-20" },
      { color: "Sand", colorHex: "#D8CBAE", size: "24x24", price: 52, stock: 3, sku: "PIL-SAN-24" },
      { color: "Charcoal", colorHex: "#3B3A36", size: "18x18", price: 44, stock: 5, sku: "PIL-CHA-18" },
      { color: "Charcoal", colorHex: "#3B3A36", size: "20x20", price: 48, stock: 0, sku: "PIL-CHA-20" },
      { color: "Charcoal", colorHex: "#3B3A36", size: "24x24", price: 54, stock: 2, sku: "PIL-CHA-24" },
    ],
  },
  {
    slug: "oak-side-table",
    name: "Oak Side Table",
    categorySlug: "furniture",
    type: "simple",
    price: 210,
    stock: 5,
    color: "Natural Oak",
    colorHex: "#C8A671",
    rating: 4.9,
    description:
      "Solid oak side table with a gently tapered leg. Finished with a low-sheen hardwax oil that deepens with age.",
    images: [img("Oak Table 1"), img("Oak Table 2")],
  },
  {
    slug: "wool-blanket",
    name: "Wool Blanket",
    categorySlug: "textiles",
    type: "configurable",
    rating: 4.5,
    description:
      "A heavyweight merino wool blanket, woven on a vintage loom. Pick your colorway; each is loomed in small batches.",
    images: [img("Wool Blanket 1"), img("Wool Blanket 2")],
    variants: [
      { color: "Oat", colorHex: "#E7DCC3", price: 128, stock: 7, sku: "BLK-OAT" },
      { color: "Moss", colorHex: "#5C6E4D", price: 128, stock: 0, sku: "BLK-MOS" },
      { color: "Rust", colorHex: "#A85832", price: 138, stock: 4, sku: "BLK-RUS" },
    ],
  },
  {
    slug: "amber-glass-vase",
    name: "Amber Glass Vase",
    categorySlug: "decor",
    type: "simple",
    price: 34,
    stock: 0,
    color: "Amber",
    colorHex: "#C9A227",
    rating: 4.3,
    description:
      "Mouth-blown amber glass vase with a slightly irregular silhouette. Sold out right now — restocking soon.",
    images: [img("Amber Vase 1"), img("Amber Vase 2")],
  },
  {
    slug: "ceramic-dinner-set",
    name: "Ceramic Dinner Set (4pc)",
    categorySlug: "tableware",
    type: "configurable",
    rating: 4.7,
    description:
      "A four-piece stoneware set — dinner plate, side plate, and two bowls — glazed in a matte reactive finish.",
    images: [img("Dinner Set 1"), img("Dinner Set 2")],
    variants: [
      { color: "Bone", colorHex: "#EDE7DA", price: 96, stock: 12, sku: "DIN-BON" },
      { color: "Slate", colorHex: "#5B6168", price: 96, stock: 1, sku: "DIN-SLA" },
    ],
  },
  {
    slug: "brass-wall-hook-set",
    name: "Brass Wall Hook Set",
    categorySlug: "decor",
    type: "simple",
    price: 24,
    stock: 30,
    color: "Brass",
    colorHex: "#B08D57",
    rating: 4.4,
    description:
      "Set of three solid brass hooks with a hand-polished finish. Includes mounting hardware.",
    images: [img("Brass Hooks 1"), img("Brass Hooks 2")],
  },
  {
    slug: "walnut-bookshelf",
    name: "Walnut Bookshelf",
    categorySlug: "furniture",
    type: "simple",
    price: 480,
    stock: 2,
    color: "Walnut",
    colorHex: "#5B3A29",
    rating: 4.9,
    description:
      "A five-shelf walnut bookcase, joined without visible fasteners. Built to order in small runs.",
    images: [img("Bookshelf 1"), img("Bookshelf 2")],
  },
  {
    slug: "cotton-bath-towel",
    name: "Cotton Bath Towel",
    categorySlug: "textiles",
    type: "configurable",
    rating: 4.2,
    description:
      "Long-staple combed cotton, 600gsm. Soft from the first wash and gets softer with every one after.",
    images: [img("Bath Towel 1"), img("Bath Towel 2")],
    variants: [
      { color: "White", colorHex: "#F5F3EE", size: "Hand", price: 14, stock: 20, sku: "TWL-WHI-H" },
      { color: "White", colorHex: "#F5F3EE", size: "Bath", price: 26, stock: 15, sku: "TWL-WHI-B" },
      { color: "White", colorHex: "#F5F3EE", size: "Bath Sheet", price: 38, stock: 6, sku: "TWL-WHI-BS" },
      { color: "Clay", colorHex: "#B5651D", size: "Hand", price: 14, stock: 0, sku: "TWL-CLA-H" },
      { color: "Clay", colorHex: "#B5651D", size: "Bath", price: 26, stock: 9, sku: "TWL-CLA-B" },
      { color: "Clay", colorHex: "#B5651D", size: "Bath Sheet", price: 38, stock: 0, sku: "TWL-CLA-BS" },
    ],
  },
  {
    slug: "iron-candle-holder",
    name: "Iron Candle Holder",
    categorySlug: "decor",
    type: "simple",
    price: 19,
    stock: 40,
    color: "Black Iron",
    colorHex: "#2B2B2B",
    rating: 4.1,
    description: "A slim forged-iron taper holder with a blackened finish. Sold individually.",
    images: [img("Candle Holder 1"), img("Candle Holder 2")],
  },
];

const BANNERS = [
  {
    eyebrow: "New Arrivals",
    title: "Objects made to be used, not just displayed",
    copy: "Small-batch furniture and textiles from independent makers, chosen for how they age.",
    ctaHref: "/products",
    ctaLabel: "Shop the collection",
    image: "https://placehold.co/1600x900/2F4739/F6F3EC?text=Living+Room+Edit",
    sortOrder: 1,
  },
  {
    eyebrow: "This Week",
    title: "Linen, restocked in three new colorways",
    copy: "Stonewashed and pre-shrunk, cut generously, and finished by hand.",
    ctaHref: "/products?category=Textiles",
    ctaLabel: "Shop Textiles",
    image: "https://placehold.co/1600x900/B5651D/F6F3EC?text=Linen+Restock",
    sortOrder: 2,
  },
  {
    eyebrow: "Studio Notes",
    title: "Walnut bookshelves, built in runs of twelve",
    copy: "We work with one workshop in Vermont — no dropshipping, no unlimited runs.",
    ctaHref: "/products?category=Furniture",
    ctaLabel: "Shop Furniture",
    image: "https://placehold.co/1600x900/5B3A29/F6F3EC?text=Walnut+Workshop",
    sortOrder: 3,
  },
];

const FEATURES = [
  { title: "Free shipping over $100", copy: "Flat $8 under that, anywhere in the US.", sortOrder: 1 },
  { title: "30-day returns", copy: "Unused items, original packaging.", sortOrder: 2 },
  { title: "Made to order", copy: "Most furniture ships in 2–4 weeks.", sortOrder: 3 },
];

export class SeedData1700000000001 implements MigrationInterface {
  name = "SeedData1700000000001";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Categories ---
    const categoryIdBySlug = new Map<string, string>();
    for (const cat of CATEGORIES) {
      const rows = await queryRunner.query(
        `INSERT INTO "aura_categories" ("name", "slug", "image", "sort_order")
         VALUES ($1, $2, $3, $4) RETURNING "id";`,
        [cat.name, cat.slug, cat.image, cat.sortOrder]
      );
      categoryIdBySlug.set(cat.slug, rows[0].id);
    }

    // --- Products (+ variants for configurable ones) ---
    for (const product of PRODUCTS) {
      const categoryId = categoryIdBySlug.get(product.categorySlug);
      if (!categoryId) {
        throw new Error(`Unknown category slug in seed data: ${product.categorySlug}`);
      }

      if (product.type === "simple") {
        await queryRunner.query(
          `INSERT INTO "aura_products"
             ("slug", "name", "description", "type", "category_id",
              "price", "stock", "color", "color_hex", "rating", "images")
           VALUES ($1, $2, $3, 'simple', $4, $5, $6, $7, $8, $9, $10::jsonb);`,
          [
            product.slug,
            product.name,
            product.description,
            categoryId,
            product.price,
            product.stock,
            product.color,
            product.colorHex,
            product.rating,
            JSON.stringify(product.images),
          ]
        );
      } else {
        const rows = await queryRunner.query(
          `INSERT INTO "aura_products"
             ("slug", "name", "description", "type", "category_id",
              "price", "stock", "color", "color_hex", "rating", "images")
           VALUES ($1, $2, $3, 'configurable', $4, NULL, NULL, 'Multiple', NULL, $5, $6::jsonb)
           RETURNING "id";`,
          [
            product.slug,
            product.name,
            product.description,
            categoryId,
            product.rating,
            JSON.stringify(product.images),
          ]
        );
        const productId = rows[0].id;

        for (const variant of product.variants) {
          await queryRunner.query(
            `INSERT INTO "aura_product_variants"
               ("product_id", "color", "color_hex", "size", "price", "stock", "sku")
             VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [
              productId,
              variant.color ?? null,
              variant.colorHex ?? null,
              variant.size ?? null,
              variant.price,
              variant.stock,
              variant.sku,
            ]
          );
        }
      }
    }

    // --- Banners ---
    for (const banner of BANNERS) {
      await queryRunner.query(
        `INSERT INTO "aura_banners"
           ("eyebrow", "title", "copy", "cta_href", "cta_label", "image", "sort_order")
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          banner.eyebrow,
          banner.title,
          banner.copy,
          banner.ctaHref,
          banner.ctaLabel,
          banner.image,
          banner.sortOrder,
        ]
      );
    }

    // --- Features ---
    for (const feature of FEATURES) {
      await queryRunner.query(
        `INSERT INTO "aura_features" ("title", "copy", "sort_order") VALUES ($1, $2, $3);`,
        [feature.title, feature.copy, feature.sortOrder]
      );
    }

    // --- Demo user (for trying out login without registering first) ---
    // email: demo@aura.com / password: Passw0rd!
    const passwordHash = bcrypt.hashSync("Passw0rd!", 10);
    await queryRunner.query(
      `INSERT INTO "aura_users" ("first_name", "last_name", "email", "password_hash")
       VALUES ($1, $2, $3, $4);`,
      ["Demo", "Shopper", "demo@aura.com", passwordHash]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "aura_users" WHERE "email" = 'demo@aura.com';`);
    await queryRunner.query(`DELETE FROM "aura_features";`);
    await queryRunner.query(`DELETE FROM "aura_banners";`);
    await queryRunner.query(`DELETE FROM "aura_product_variants";`);
    await queryRunner.query(`DELETE FROM "aura_products";`);
    await queryRunner.query(`DELETE FROM "aura_categories";`);
  }
}
