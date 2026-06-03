import { useEffect, useState } from "react";
import { getAdminCars } from "../../services/adminCarService";

const getImg = (car) =>
  car?.primary_image ||
  car?.image ||
  car?.images?.find((i) => i.is_primary)?.storage_path ||
  car?.images?.[0]?.storage_path ||
  null;

const normalize = (car) => ({
  id:                 car.id,
  brand:              car.brand || "",
  model:              car.model || "",
  year:               car.year  || null,
  status:             car.status,
  listing_type:       car.listing_type,
  sale_price:         car.sale_price,
  rent_price_per_day: car.rent_price_per_day,
  image:              getImg(car),
});

function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCars()
      .then((data) => {
        const cars = data?.cars || data?.data?.cars || data?.data || data?.rows || [];

        const sale = cars.filter((c) => c.listing_type === "sale");
        const rent = cars.filter((c) => c.listing_type === "rent");

        setStats({
          // ── Sale stats ──────────────────────────────────
          availableSale:  sale.filter((c) => c.status === "available").length,
          reservedSale:   sale.filter((c) => c.status === "reserved").length,
          soldSale:       sale.filter((c) => c.status === "sold").length,

          // ── Rental stats ─────────────────────────────────
          availableRental:   rent.filter((c) => c.status === "available").length,
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
