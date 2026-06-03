import { useEffect, useState } from "react";
import { getAdminCars } from "../../services/adminCarService";

const getImg = (car) =>
  car?.primary_image ||
  car?.image ||
  car?.images?.find((i) => i.is_primary)?.storage_path ||
  car?.images?.[0]?.storage_path ||
  null;

function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCars()
      .then((data) => {
        const cars = data?.cars || data?.data?.cars || data?.data || data?.rows || [];

        const isUnavailable = (car) =>
          ["rented", "sold", "maintenance", "reserved"].includes(car.status);

        const available   = cars.filter((car) => !isUnavailable(car));
        const unavailable = cars.filter(isUnavailable);

        const normalize = (car) => ({
          id:                car.id,
          brand:             car.brand || "",
          model:             car.model || "",
          year:              car.year  || null,
          status:            car.status,
          sale_price:        car.sale_price,
          rent_price_per_day: car.rent_price_per_day,
          image:             getImg(car),
        });

        setStats({
          // availability
          availableSale:     available.filter((c) => c.sale_price != null).length,
          availableRental:   available.filter((c) => c.rent_price_per_day != null).length,
          unavailableSale:   unavailable.filter((c) => c.sale_price != null).length,
          unavailableRental: unavailable.filter((c) => c.rent_price_per_day != null).length,

          // totals for performance cards
          soldTotal:   cars.filter((c) => c.status === "sold").length,
          rentedTotal: cars.filter((c) => c.status === "rented").length,

          // activity lists
          soldCars:   cars.filter((c) => c.status === "sold").slice(0, 6).map(normalize),
          rentedCars: cars.filter((c) => c.status === "rented").slice(0, 6).map(normalize),
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

export default useDashboardStats;
