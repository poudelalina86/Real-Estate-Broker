export function formatNpr(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0
  }).format(value);
}

