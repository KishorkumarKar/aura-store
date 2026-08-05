
import type { PriceBucket } from "@/lib/types";
export const PRICE_BUCKETS: PriceBucket[] = [
  { id: "0-25", label: "Under $25", min: 0, max: 25 },
  { id: "25-50", label: "$25 – $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-250", label: "$100 – $250", min: 100, max: 250 },
  { id: "250-999999", label: "$250 and up", min: 250, max: Infinity },
];

export const CATEGORIES = ["Furniture", "Textiles", "Decor", "Tableware", "Lighting"];