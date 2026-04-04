import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/admin.css";
import mockAdminCars from "../data/mockAdminCars";

const emptyRentalForm = {
  name: "",
  brand: "",
  year: "",
  rentPricePerDay: "",
  fuel: "",
  drive: "",
  doors: "",
  seats: "",
  transmission: "",
  image: "",
};

function AdminRentalDetailPage() {
  const { id } = useParams();
  const isCreateMode = id === "new";

  const [formData, setFormData] = useState(emptyRentalForm);

  useEffect(() => {
    if (isCreateMode) {
      setFormData(emptyRentalForm);
      return;
    }

    const car = mockAdminCars.find((item) => String(item.id) === String(id));

    if (car) {
      setFormData({
        name: car.name || "",
        brand: car.brand || "",
        year: car.year || "",
        rentPricePerDay: car.rental?.pricePerDay || "",
        fuel: car.specs?.fuel || "",
        drive: car.specs?.drive || "",
        doors: car.specs?.doors || "",
        seats: car.specs?.seats || "",
        transmission: car.specs?.transmission || "",
        image: car.image || "",
      });
    }
  }, [id, isCreateMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isCreateMode) {
      console.log("Create new rental car:", formData);
    } else {
      console.log("Update rental car:", id, formData);
    }
  };

  return (
    <div className="admin-page-section">
      <div className="admin-hero-block">
        <h1 className="admin-hero-block__title">
          {isCreateMode ? "Add New Rental Car" : "Edit Rental Car"}
        </h1>
        <p className="admin-hero-block__subtitle">
          {isCreateMode
            ? "Create a new rental listing."
            : "Update existing rental car details."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="admin-detail-form">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" />
        <input name="year" value={formData.year} onChange={handleChange} placeholder="Year" />
        <input
          name="rentPricePerDay"
          value={formData.rentPricePerDay}
          onChange={handleChange}
          placeholder="Rent Price Per Day"
        />
        <input name="fuel" value={formData.fuel} onChange={handleChange} placeholder="Fuel" />
        <input name="drive" value={formData.drive} onChange={handleChange} placeholder="Drive" />
        <input name="doors" value={formData.doors} onChange={handleChange} placeholder="Doors" />
        <input name="seats" value={formData.seats} onChange={handleChange} placeholder="Seats" />
        <input
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          placeholder="Transmission"
        />
        <input name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" />

        <button type="submit">
          {isCreateMode ? "Create Rental Car" : "Update Rental Car"}
        </button>
      </form>
    </div>
  );
}

export default AdminRentalDetailPage;