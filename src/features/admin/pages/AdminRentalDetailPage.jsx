import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminMediaUploader from "../components/AdminMediaUploader";
import AdminDetailHero from "../components/AdminDetailHero";
import SpecGrid from "../components/SpecGrid";
import InfoRows from "../components/InfoRows";
import RentalTermsSection from "../components/RentalTermsSection";
import ConfirmBar from "../components/ConfirmBar";
import mockAdminCars from "../data/mockAdminCars";

const defaultRentalTerms = [
  "Driver must have a valid license.",
  "Deposit may be required before pickup.",
  "Late return may include extra charges.",
];

const emptyRentalForm = {
  name: "",
  price: "",
  media: [],
  specs: {
    fuel: "",
    transmission: "",
    color: "",
    engine: "",
    drive: "",
    seats: "",
  },
  info: {
    rent7: "",
    rent30: "",
    deposit: "",
  },
  terms: defaultRentalTerms,
};

function AdminRentalDetailPage() {
  const { id } = useParams();
  const isCreateMode = id === "new";

  const [form, setForm] = useState(emptyRentalForm);

  const rentalFields = [
    { key: "rent7", label: "Rent for 7 Days", placeholder: "5000 THB" },
    { key: "rent30", label: "Rent for 30 Days", placeholder: "21000 THB" },
    { key: "deposit", label: "Deposit", placeholder: "Optional" },
  ];

  useEffect(() => {
    if (isCreateMode) {
      setForm(emptyRentalForm);
      return;
    }

    const car = mockAdminCars.find((item) => String(item.id) === String(id));

    if (!car) return;

    setForm({
      name: car.name || "",
      price: car.rental?.pricePerDay || "",
      media: car.image
        ? [
            {
              id: `existing-${car.id}`,
              url: car.image,
              type: "image",
            },
          ]
        : [],
      specs: {
        fuel: car.specs?.fuel || "",
        transmission: car.specs?.transmission || "",
        color: car.specs?.color || "",
        engine: car.specs?.engine || "",
        drive: car.specs?.drive || "",
        seats: car.specs?.seats || "",
      },
      info: {
        rent7: car.rental?.price7Days || "",
        rent30: car.rental?.price30Days || "",
        deposit: car.rental?.deposit || "",
      },
      terms:
        car.rental?.terms && typeof car.rental.terms === "string"
          ? [car.rental.terms]
          : Array.isArray(car.rental?.terms) && car.rental.terms.length > 0
          ? car.rental.terms
          : defaultRentalTerms,
    });
  }, [id, isCreateMode]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSpecs = (key, value) => {
    setForm((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [key]: value,
      },
    }));
  };

  const updateInfo = (key, value) => {
    setForm((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        [key]: value,
      },
    }));
  };

  const handleTermChange = (index, value) => {
    const newTerms = [...form.terms];
    newTerms[index] = value;

    setForm((prev) => ({
      ...prev,
      terms: newTerms,
    }));
  };

  const handleAddTerm = () => {
    setForm((prev) => ({
      ...prev,
      terms: [...prev.terms, ""],
    }));
  };

  const handleDeleteTerm = (index) => {
    setForm((prev) => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    if (form.media.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const hasImage = form.media.some((item) => item.type === "image");

    if (!hasImage) {
      alert("Please upload at least one image.");
      return;
    }

    console.log(
      isCreateMode ? "CREATE RENTAL CAR" : "UPDATE RENTAL CAR",
      form
    );
  };

  return (
    <div className="admin-detail-page">
      <div className="admin-detail-page__left">
        <div className="admin-detail-panel">
          <AdminMediaUploader
            media={form.media}
            onChange={(newMedia) => updateField("media", newMedia)}
          />
        </div>

        <div className="admin-detail-panel">
          <h3 className="admin-section-title">
            {isCreateMode ? "Rental Car Info" : "Edit Rental Car Info"}
          </h3>
          <AdminDetailHero
            name={form.name}
            price={form.price}
            onChange={updateField}
            namePlaceholder="Rental Car Name"
            pricePlaceholder="Price Per Day"
          />
        </div>

        <div className="admin-detail-panel">
          <SpecGrid specs={form.specs} onChange={updateSpecs} />
        </div>
      </div>

      <div className="admin-detail-page__right">
        <div className="admin-detail-panel">
          <InfoRows
            fields={rentalFields}
            values={form.info}
            onChange={updateInfo}
          />
        </div>

        <div className="admin-detail-panel">
          <RentalTermsSection
            lines={form.terms}
            onChange={handleTermChange}
            onAddRow={handleAddTerm}
            onDeleteRow={handleDeleteTerm}
            title="Car Rental Terms and Conditions"
          />
        </div>

        <div className="admin-detail-panel admin-detail-panel--action">
          <ConfirmBar
            onClick={handleSubmit}
            label={isCreateMode ? "Create Rental Car" : "Update Rental Car"}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminRentalDetailPage;