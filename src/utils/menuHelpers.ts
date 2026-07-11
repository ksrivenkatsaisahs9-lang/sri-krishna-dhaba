export function formatPrice(price: number | string): string {
  if (typeof price === "number") return `₹${price}`;
  if (price.includes("/")) {
    return price.split("/").map(p => `₹${p.trim()}`).join(" / ");
  }
  return `₹${price}`;
}

export function getNumericPrice(price: number | string): number {
  if (typeof price === "number") return price;
  const parsed = parseFloat(price.split("/")[0].trim());
  return isNaN(parsed) ? 0 : parsed;
}
