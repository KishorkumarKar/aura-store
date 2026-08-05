export interface ColorOption {
  value: string;
  hex: string;
}

export interface BaseProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: number;
  description: string;
  images: string[];
}

export interface SimpleProduct extends BaseProduct {
  type: "simple";
  price: number;
  stock: number;
  color: string;
  colorHex: string;
}

export interface ConfigurableVariant {
  color?: string;
  size?: string;
  price: number;
  stock: number;
  sku: string;
}

export type OptionType = "color" | "size";

export interface ConfigurableProduct extends BaseProduct {
  type: "configurable";
  color: string; // display placeholder, e.g. "Multiple"
  optionTypes: OptionType[];
  options: {
    color?: ColorOption[];
    size?: string[];
  };
  variants: ConfigurableVariant[];
}

export type Product = SimpleProduct | ConfigurableProduct;

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantKey: string;
  variantLabel: string | null;
  price: number;
  quantity: number;
  stock: number;
}

export interface PlacedOrder {
  orderNumber: string;
  email: string;
  name: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  placedAt: string;
}

export interface PriceBucket {
  id: string;
  label: string;
  min: number;
  max: number;
}
