import type { ColorOption, Product } from "@/lib/types";

// Mock product catalog.
// type: "simple"        -> single price/stock, no options
// type: "configurable"  -> has options (color/size) and per-variant price/stock

function img(seed: string, w = 800, h = 900): string {
  return `https://placehold.co/${w}x${h}/EDE8DB/22201C?text=${encodeURIComponent(
    seed
  )}`;
}

export const products: Product[] = [
  {
    id: "p1",
    slug: "clay-table-lamp",
    name: "Clay Table Lamp",
    category: "Lighting",
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
    id: "p2",
    slug: "linen-throw-pillow",
    name: "Linen Throw Pillow",
    category: "Textiles",
    type: "configurable",
    color: "Multiple",
    rating: 4.8,
    description:
      "Stonewashed linen cover over a feather-down insert. Choose a colorway and a size to match your room.",
    optionTypes: ["color", "size"],
    options: {
      color: [
        { value: "Sage", hex: "#7C8B6F" },
        { value: "Sand", hex: "#D8CBAE" },
        { value: "Charcoal", hex: "#3B3A36" },
      ],
      size: ["18x18", "20x20", "24x24"],
    },
    variants: [
      { color: "Sage", size: "18x18", price: 42, stock: 9, sku: "PIL-SAG-18" },
      { color: "Sage", size: "20x20", price: 46, stock: 6, sku: "PIL-SAG-20" },
      { color: "Sage", size: "24x24", price: 52, stock: 0, sku: "PIL-SAG-24" },
      { color: "Sand", size: "18x18", price: 42, stock: 11, sku: "PIL-SAN-18" },
      { color: "Sand", size: "20x20", price: 46, stock: 8, sku: "PIL-SAN-20" },
      { color: "Sand", size: "24x24", price: 52, stock: 3, sku: "PIL-SAN-24" },
      { color: "Charcoal", size: "18x18", price: 44, stock: 5, sku: "PIL-CHA-18" },
      { color: "Charcoal", size: "20x20", price: 48, stock: 0, sku: "PIL-CHA-20" },
      { color: "Charcoal", size: "24x24", price: 54, stock: 2, sku: "PIL-CHA-24" },
    ],
    images: [img("Linen Pillow 1"), img("Linen Pillow 2")],
  },
  {
    id: "p3",
    slug: "oak-side-table",
    name: "Oak Side Table",
    category: "Furniture",
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
    id: "p4",
    slug: "wool-blanket",
    name: "Wool Blanket",
    category: "Textiles",
    type: "configurable",
    color: "Multiple",
    rating: 4.5,
    description:
      "A heavyweight merino wool blanket, woven on a vintage loom. Pick your colorway; each is loomed in small batches.",
    optionTypes: ["color"],
    options: {
      color: [
        { value: "Oat", hex: "#E7DCC3" },
        { value: "Moss", hex: "#5C6E4D" },
        { value: "Rust", hex: "#A85832" },
      ],
    },
    variants: [
      { color: "Oat", price: 128, stock: 7, sku: "BLK-OAT" },
      { color: "Moss", price: 128, stock: 0, sku: "BLK-MOS" },
      { color: "Rust", price: 138, stock: 4, sku: "BLK-RUS" },
    ],
    images: [img("Wool Blanket 1"), img("Wool Blanket 2")],
  },
  {
    id: "p5",
    slug: "amber-glass-vase",
    name: "Amber Glass Vase",
    category: "Decor",
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
    id: "p6",
    slug: "ceramic-dinner-set",
    name: "Ceramic Dinner Set (4pc)",
    category: "Tableware",
    type: "configurable",
    color: "Multiple",
    rating: 4.7,
    description:
      "A four-piece stoneware set — dinner plate, side plate, and two bowls — glazed in a matte reactive finish.",
    optionTypes: ["color"],
    options: {
      color: [
        { value: "Bone", hex: "#EDE7DA" },
        { value: "Slate", hex: "#5B6168" },
      ],
    },
    variants: [
      { color: "Bone", price: 96, stock: 12, sku: "DIN-BON" },
      { color: "Slate", price: 96, stock: 1, sku: "DIN-SLA" },
    ],
    images: [img("Dinner Set 1"), img("Dinner Set 2")],
  },
  {
    id: "p7",
    slug: "brass-wall-hook-set",
    name: "Brass Wall Hook Set",
    category: "Decor",
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
    id: "p8",
    slug: "walnut-bookshelf",
    name: "Walnut Bookshelf",
    category: "Furniture",
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
    id: "p9",
    slug: "cotton-bath-towel",
    name: "Cotton Bath Towel",
    category: "Textiles",
    type: "configurable",
    color: "Multiple",
    rating: 4.2,
    description:
      "Long-staple combed cotton, 600gsm. Soft from the first wash and gets softer with every one after.",
    optionTypes: ["color", "size"],
    options: {
      color: [
        { value: "White", hex: "#F5F3EE" },
        { value: "Clay", hex: "#B5651D" },
      ],
      size: ["Hand", "Bath", "Bath Sheet"],
    },
    variants: [
      { color: "White", size: "Hand", price: 14, stock: 20, sku: "TWL-WHI-H" },
      { color: "White", size: "Bath", price: 26, stock: 15, sku: "TWL-WHI-B" },
      { color: "White", size: "Bath Sheet", price: 38, stock: 6, sku: "TWL-WHI-BS" },
      { color: "Clay", size: "Hand", price: 14, stock: 0, sku: "TWL-CLA-H" },
      { color: "Clay", size: "Bath", price: 26, stock: 9, sku: "TWL-CLA-B" },
      { color: "Clay", size: "Bath Sheet", price: 38, stock: 0, sku: "TWL-CLA-BS" },
    ],
    images: [img("Bath Towel 1"), img("Bath Towel 2")],
  },
  {
    id: "p10",
    slug: "iron-candle-holder",
    name: "Iron Candle Holder",
    category: "Decor",
    type: "simple",
    price: 19,
    stock: 40,
    color: "Black Iron",
    colorHex: "#2B2B2B",
    rating: 4.1,
    description:
      "A slim forged-iron taper holder with a blackened finish. Sold individually.",
    images: [img("Candle Holder 1"), img("Candle Holder 2")],
  },
];

export function getAllColors(): ColorOption[] {
  const map = new Map<string, string>();
  products.forEach((p) => {
    if (p.type === "simple") {
      map.set(p.color, p.colorHex);
    } else {
      p.options.color?.forEach((c) => map.set(c.value, c.hex));
    }
  });
  return Array.from(map, ([value, hex]) => ({ value, hex }));
}

export function getPriceRange(p: Product): [number, number] {
  if (p.type === "simple") return [p.price, p.price];
  const prices = p.variants.map((v) => v.price);
  return [Math.min(...prices), Math.max(...prices)];
}

export function getDisplayPrice(p: Product): string {
  const [min, max] = getPriceRange(p);
  return min === max ? `$${min}` : `$${min} – $${max}`;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
