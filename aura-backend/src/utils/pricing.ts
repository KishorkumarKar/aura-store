const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING = 8;
const TAX_RATE = 0.07;

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeTotals(lines: { price: number; quantity: number }[]) {
  const subtotal = round2(
    lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
  );
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + shipping + tax);
  return { subtotal, shipping, tax, total };
}
