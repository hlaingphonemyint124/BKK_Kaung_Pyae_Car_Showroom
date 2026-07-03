import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "../styles/admin.css";

import {
  createAdminCustomer,
  createAdminRental,
  getAdminCustomers,
  getAdminRentalCars,
} from "../services/adminRentalService";

const emptyForm = {
  car_id: "",
  customer_id: "",
  customer_phone: "",
  start_date: "",
  end_date: "",
  deposit_amount: "",
};

const getCars = (data) =>
  data?.cars || data?.data?.cars || data?.data || data?.rows || [];

const getCustomers = (data) =>
  data?.customers || data?.data?.customers || data?.data || data?.rows || [];

const getCustomerId = (data) =>
  data?.id || data?.customer?.id || data?.data?.id || data?.data?.customer?.id;

const getApiErrorMessage = (err, fallback) => {
  const data = err.response?.data;
  const details = data?.details;
  const collectMessages = (node) => {
    if (!node || typeof node !== "object") return [];

    return [
      ...(Array.isArray(node._errors) ? node._errors : []),
      ...Object.entries(node)
        .filter(([key]) => key !== "_errors")
        .flatMap(([, value]) => collectMessages(value)),
    ];
  };

  const detailMessages = collectMessages(details);

  if (detailMessages.length) {
    return detailMessages.join(" ");
  }

  if (data?.error) {
    return data.error;
  }

  return err.message || fallback;
};

const formatCar = (car) =>
  `${car.brand || "Unknown"} ${car.model || ""}${car.year ? ` (${car.year})` : ""}`.trim();

function AdminRentalRecordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCarId = searchParams.get("car_id") || "";
  const customerSearchRef = useRef(null);

  const [form, setForm] = useState({ ...emptyForm, car_id: preselectedCarId });
  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError("");

        const [carsData, customersData] = await Promise.all([
          getAdminRentalCars(),
          getAdminCustomers(),
        ]);

        const rentalCars = getCars(carsData).filter(
          (car) => car.listing_type === "rent" || car.listing_type === "rental"
        );

        setCars(rentalCars);
        setCustomers(getCustomers(customersData));
      } catch (err) {
        console.error("Failed to load rental record options:", err);
        setError(err.response?.data?.error || "Failed to load rental form data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        customerSearchRef.current &&
        !customerSearchRef.current.contains(event.target)
      ) {
        setIsCustomerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedCar = useMemo(
    () => cars.find((car) => String(car.id) === String(form.car_id)),
    [cars, form.car_id]
  );

  const filteredCustomers = useMemo(() => {
    const query = customerQuery.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) => {
      const name = String(customer.full_name || customer.name || "").toLowerCase();
      const email = String(customer.email || "").toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [customers, customerQuery]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCustomerInput = (value) => {
    setCustomerQuery(value);
    updateField("customer_id", "");
    setIsCustomerOpen(true);
  };

  const handleCustomerSelect = (customer) => {
    updateField("customer_id", customer.id);
    setCustomerQuery(customer.full_name || customer.name || "");
    setIsCustomerOpen(false);
  };

  const handleSubmit = async () => {
    if (saving) return;

    const customerName = customerQuery.trim();
    const customerPhone = form.customer_phone.trim();

    if (!form.car_id || !customerName || !form.start_date || !form.end_date) {
      setError("Please select a car, enter a customer name, start date, and end date.");
      return;
    }

    if (!form.customer_id && !customerPhone) {
      setError("Please enter a phone number for a new walk-in customer.");
      return;
    }

    if (new Date(form.end_date) < new Date(form.start_date)) {
      setError("End date must be after or equal to start date.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      let customerId = form.customer_id;

      if (!customerId) {
        let createdCustomer;

        try {
          createdCustomer = await createAdminCustomer({
            full_name: customerName,
            phone: customerPhone,
          });
        } catch (err) {
          throw new Error(getApiErrorMessage(err, "Failed to create customer."));
        }

        customerId = getCustomerId(createdCustomer);

        if (!customerId) {
          throw new Error("Customer was created, but no customer id was returned.");
        }
      }

      const payload = {
        car_id: form.car_id,
        customer_id: customerId,
        start_date: form.start_date,
        end_date: form.end_date,
        ...(form.deposit_amount !== ""
          ? { deposit_amount: Number(form.deposit_amount) }
          : {}),
      };

      await createAdminRental(payload);
      setSuccess("Rental record created successfully.");

      setTimeout(() => {
        navigate("/rental-history");
      }, 700);
    } catch (err) {
      console.error("Failed to create rental record:", err);
      setError(getApiErrorMessage(err, "Failed to create rental record."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="admin-state-message">Loading rental record form...</p>;
  }

  return (
    <div className="ad-wrapper">
      <div className="admin-detail-panel">
        <h3 className="admin-section-title">Create Rental Record</h3>

        {selectedCar && (
          <p className="admin-rental-note">
            {formatCar(selectedCar)}
            {selectedCar.rent_price_per_day
              ? ` - ${Number(selectedCar.rent_price_per_day).toLocaleString()} THB/day`
              : ""}
          </p>
        )}

        {error && (
          <p className="admin-state-message admin-state-message--error">{error}</p>
        )}

        {success && (
          <p className="admin-state-message">{success}</p>
        )}

        <div className="admin-info-stack">
          <div className="admin-detail-field">
            <span className="admin-detail-field__label">Rental Car</span>
            <select
              className="admin-detail-input"
              value={form.car_id}
              onChange={(e) => updateField("car_id", e.target.value)}
            >
              <option value="">Select rental car</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {formatCar(car)}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-detail-field">
            <span className="admin-detail-field__label">Customer</span>
            <div ref={customerSearchRef} style={{ position: "relative" }}>
              <input
                className="admin-detail-input"
                value={customerQuery}
                placeholder="Search customer by name or email"
                onFocus={() => setIsCustomerOpen(true)}
                onChange={(e) => handleCustomerInput(e.target.value)}
              />

              {isCustomerOpen && (
                <div
                  style={{
                    position: "absolute",
                    zIndex: 20,
                    top: "calc(100% + 6px)",
                    left: 0,
                    right: 0,
                    maxHeight: 220,
                    overflowY: "auto",
                    border: "1px solid rgba(148, 163, 184, 0.35)",
                    borderRadius: 8,
                    background: "var(--color-surface, #fff)",
                    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.16)",
                    padding: 6,
                  }}
                >
                  {filteredCustomers.length === 0 ? (
                    <div
                      style={{
                        padding: "10px 12px",
                        fontSize: 13,
                        color: "#6b7280",
                      }}
                    >
                      No customers found.
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => handleCustomerSelect(customer)}
                        style={{
                          display: "block",
                          width: "100%",
                          border: 0,
                          borderRadius: 6,
                          background: "transparent",
                          padding: "9px 10px",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ display: "block", fontWeight: 700 }}>
                          {customer.full_name || customer.name || "Unnamed customer"}
                        </span>
                        {customer.email && (
                          <span
                            style={{
                              display: "block",
                              marginTop: 2,
                              fontSize: 12,
                              color: "#6b7280",
                            }}
                          >
                            {customer.email}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="admin-detail-field">
            <span className="admin-detail-field__label">Customer Phone</span>
            <input
              className="admin-detail-input"
              value={form.customer_phone}
              placeholder="Required for new walk-in customer"
              onChange={(e) => updateField("customer_phone", e.target.value)}
            />
          </div>

          <div className="admin-detail-field">
            <span className="admin-detail-field__label">Start Date</span>
            <input
              className="admin-detail-input"
              type="date"
              value={form.start_date}
              onChange={(e) => updateField("start_date", e.target.value)}
            />
          </div>

          <div className="admin-detail-field">
            <span className="admin-detail-field__label">End Date</span>
            <input
              className="admin-detail-input"
              type="date"
              value={form.end_date}
              onChange={(e) => updateField("end_date", e.target.value)}
            />
          </div>

          <div className="admin-detail-field">
            <span className="admin-detail-field__label">Deposit Amount</span>
            <input
              className="admin-detail-input"
              type="number"
              min="0"
              step="0.01"
              value={form.deposit_amount}
              placeholder="Optional"
              onChange={(e) => updateField("deposit_amount", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="admin-detail-panel admin-detail-panel--action">
        <button
          type="button"
          className="admin-confirm"
          onClick={handleSubmit}
          disabled={saving}
        >
          <span>{saving ? "Creating..." : "Create Rental Record"}</span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

export default AdminRentalRecordPage;
