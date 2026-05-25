import { useEffect, useState } from "react";
import { getAdminCars } from "../../services/adminCarService";

function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCars()
      .then((data) => {
        const cars = data?.cars || data?.data?.cars || data?.data || data?.rows || [];

        const isUnavailable = (car) =>
          ["rented", "sold", "maintenance", "reserved"].includes(car.status);

        const available = cars.filter((car) => !isUnavailable(car));
        const unavailable = cars.filter(isUnavailable);

        setStats({
          total: cars.length,
          sale: cars.filter((car) => car.sale_price != null).length,
          rental: cars.filter((car) => car.rent_price_per_day != null).length,
          available: available.length,
          availableSale: available.filter((car) => car.sale_price != null).length,
          availableRental: available.filter((car) => car.rent_price_per_day != null).length,
          unavailable: unavailable.length,
          unavailableSale: unavailable.filter((car) => car.sale_price != null).length,
          unavailableRental: unavailable.filter((car) => car.rent_price_per_day != null).length,
          soldOut: cars.filter((car) => car.status === "sold").length,
          rentCount: cars.filter((car) => car.status === "rented").length,
          soldCars: cars.filter((car) => car.status === "sold").slice(0, 5),
          rentedCars: cars.filter((car) => car.status === "rented").slice(0, 5),
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

export default useDashboardStats;