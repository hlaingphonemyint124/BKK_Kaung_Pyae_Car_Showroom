import { useEffect, useState } from "react";
import { getAdminCars } from "../../services/adminCarService";

const getImg = (car) =>
  car?.primary_image ||
  car?.image ||
  car?.images?.find((i) => i.is_primary)?.storage_path ||
  car?.images?.[0]?.storage_path ||
  null;

const normalize = (car) => ({
  id:                 car.id ?? car._id,
  _id:                car._id,
  brand:              car.brand || "",
  model:              car.model || "",
  year:               car.year  || null,
  status:             car.status,
  listing_type:       car.listing_type,
  sale_price:         car.sale_price,
  rent_price_per_day: car.rent_price_per_day,
  rent_count:         car.rent_count,
  image:              getImg(car),
});

const isRentalCar = (car) =>
  car?.listing_type === "rent" ||
  car?.listing_type === "rental" ||
  (car?.listing_type == null && car?.rent_price_per_day != null);

const hasRentalListingType = (car) =>
  car?.listing_type === "rent" ||
  car?.listing_type === "rental";

const isSaleCar = (car) =>
  car?.listing_type === "sale" ||
  (car?.listing_type == null && car?.sale_price != null);

function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCars()
      .then((data) => {
        const cars = data?.cars || data?.data?.cars || data?.data || data?.rows || [];

        const sale = cars.filter(isSaleCar);
        const rent = cars.filter(isRentalCar);
        const availableRental = rent.filter((c) => c.status === "available").length;
        const unavailableRental = cars.filter(
          (c) =>
            hasRentalListingType(c) &&
            (c.status === "rented" || c.status === "maintenance")
        ).length;

        setStats({
          // ── Sale stats ──────────────────────────────────
          availableSale:  sale.filter((c) => c.status === "available").length,
          reservedSale:   sale.filter((c) => c.status === "reserved").length,
          soldSale:       sale.filter((c) => c.status === "sold").length,

          // ── Rental stats ─────────────────────────────────
          availableRental,
          unavailableRental,
          totalRental:       availableRental + unavailableRental,
          rentedRental:      rent.filter((c) => c.status === "rented").length,
          maintenanceRental: rent.filter((c) => c.status === "maintenance").length,

          // ── Performance totals ───────────────────────────
          soldTotal:   sale.filter((c) => c.status === "sold").length,
          rentedTotal: rent.filter((c) => c.status === "rented").length,

          // ── Activity lists ───────────────────────────────
          soldCars:   sale.filter((c) => c.status === "sold").slice(0, 6).map(normalize),
          rentedCars: rent.filter((c) => c.status === "rented").slice(0, 6).map(normalize),
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

export default useDashboardStats;
