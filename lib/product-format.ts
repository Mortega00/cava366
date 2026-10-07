export function formatProductPrice(price: number | null) {
  if (price === null) return "Consultar";
  return `$${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(price)}`;
}
