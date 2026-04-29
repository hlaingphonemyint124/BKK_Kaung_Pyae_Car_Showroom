/**
 * Resolves the best available image URL for a car object.
 * Covers all field shapes returned by the API and admin forms.
 */
export function getCarImage(car, fallback = "/images/placeholder.png") {
  return (
    car.primary_image ||
    car.images?.find((img) => img.is_primary)?.storage_path ||
    car.images?.[0]?.storage_path ||
    car.image ||
    car.img ||
    fallback
  );
}

/**
 * Formats a car's price as a display string.
 * @param {object} car  - car object with sale_price / rent_price_per_day
 * @param {"buy"|"rent"} mode  - explicitly pass mode when the car object has both fields
 */
export function formatCarPrice(car, mode) {
  const currency = car.currency_code || "THB";
  const isRent = mode === "rent" || (!car.sale_price && car.rent_price_per_day != null);
  if (isRent) {
    return `${Number(car.rent_price_per_day || 0).toLocaleString()} ${currency}/day`;
  }
  return `${Number(car.sale_price || 0).toLocaleString()} ${currency}`;
}
