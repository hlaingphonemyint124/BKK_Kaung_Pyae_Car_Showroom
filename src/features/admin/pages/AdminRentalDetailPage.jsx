import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminMediaUploader from "../components/AdminMediaUploader";
import AdminDetailHero from "../components/AdminDetailHero";
import SpecGrid from "../components/SpecGrid";
import InfoRows from "../components/InfoRows";
import RentalTermsSection from "../components/RentalTermsSection";
import ConfirmBar from "../components/ConfirmBar";
import {
  createAdminCar,
  getAdminCarById,
  updateAdminCar,
  addAdminCarImage,
} from "../services/adminCarService";

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
    mileage: 0,
    year: new Date().getFullYear(),
    currencyCode: "THB",
    status: "available",
    isPublished: false,
    rent7: "",
    rent30: "",
    deposit: "",
  },
  terms: defaultRentalTerms,
};

function AdminRentalDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreateMode = !id;

  const [form, setForm] = useState(emptyRentalForm);
  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);

  const rentalFields = [
    { key: "rent7", label: "7 Days (5% OFF)", readOnly: true },
    { key: "rent30", label: "30 Days (10% OFF)", readOnly: true },
    { key: "deposit", label: "Deposit", placeholder: "Optional" },
  ];

  useEffect(() => {
    const fetchCar = async () => {
      if (isCreateMode) {
        setForm(emptyRentalForm);
        setLoading(false);
        return;
      }

      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const car = await getAdminCarById(id);

        if (!car) {
          setForm(emptyRentalForm);
          return;
        }

        const media =
          car.images?.map((img) => ({
            id: `existing-${img.id}`,
            url: img.storage_path,
            type: "image",
            isPrimary: Boolean(img.is_primary),
            sortOrder: img.sort_order ?? 0,
            isExisting: true,
          })) || [];

        const dailyPrice = Number(car.rent_price_per_day) || 0;

        setForm({
          name: `${car.brand || ""} ${car.model || ""}`.trim(),
          price: car.rent_price_per_day ?? "",
          media,
          specs: {
            fuel: car.fuel_type || car.fuel || "",
            transmission: car.transmission || "",
            color: car.color || "",
            engine: car.engine || "",
            drive: car.drive_type || car.drive || "",
            seats: car.seats || "",
          },
          info: {
            mileage: car.mileage_km ?? "",
            year: car.year ?? "",
            currencyCode: car.currency_code ?? "THB",
            status: car.status ?? "available",
            isPublished: Boolean(car.is_published),
            rent7: dailyPrice ? Math.round(dailyPrice * 7 * 0.95).toString() : "",
            rent30: dailyPrice ? Math.round(dailyPrice * 30 * 0.9).toString() : "",
            deposit: "",
          },
          terms: defaultRentalTerms,
        });
      } catch (err) {
        console.error("Failed to fetch rental car:", err);
        setForm(emptyRentalForm);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, isCreateMode]);

  useEffect(() => {
    const dailyPrice = Number(form.price) || 0;

    if (!dailyPrice) {
      setForm((prev) => ({
        ...prev,
        info: {
          ...prev.info,
          rent7: "",
          rent30: "",
        },
      }));
      return;
    }

    const rent7 = Math.round(dailyPrice * 7 * 0.95);
    const rent30 = Math.round(dailyPrice * 30 * 0.9);

    setForm((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        rent7: rent7.toString(),
        rent30: rent30.toString(),
      },
    }));
  }, [form.price]);

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
    if (key === "rent7" || key === "rent30") return;

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

  const uploadNewImages = async (carId) => {
    const newImageItems = form.media.filter(
      (item) => item.isNew && item.type === "image" && item.file
    );

    for (let i = 0; i < newImageItems.length; i += 1) {
      const item = newImageItems[i];

      await addAdminCarImage(carId, item.file, {
        isPrimary: i === 0,
        sortOrder: i,
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Please enter car name.");
      return;
    }

    const [brand, ...modelParts] = form.name.trim().split(" ");
    const model = modelParts.join(" ");

    if (!brand || !model) {
      alert("Use format: Toyota Corolla");
      return;
    }

    if (!form.info.year) {
      alert("Please enter year.");
      return;
    }

    const imageCount = form.media.filter((item) => item.type === "image").length;
    if (imageCount === 0) {
      alert("Please add at least one image.");
      return;
    }

    const payload = {
      brand,
      model,
      year: Number(form.info.year) || new Date().getFullYear(),
      mileage_km: form.info.mileage ? Number(form.info.mileage) : 0,
      rent_price_per_day: form.price ? Number(form.price) : 0,
      currency_code: form.info.currencyCode,
      status: form.info.status,
      is_published: form.info.isPublished,
    };

    try {
      setSaving(true);

      let savedCar;

      if (isCreateMode) {
        savedCar = await createAdminCar(payload);
      } else {
        savedCar = await updateAdminCar(id, payload);
      }

      const carId = savedCar?.id || id;

      if (!carId) {
        throw new Error("Missing car id after save.");
      }

      await uploadNewImages(carId);

      navigate("/admin/rental");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.error || err.message || "Failed to save rental car."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="admin-state-message">Loading rental car details...</p>;
  }

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
            currencyCode={form.info.currencyCode}
            onChange={(key, value) => {
              if (key === "currencyCode") {
                updateInfo("currencyCode", value);
              } else {
                updateField(key, value);
              }
            }}
            namePlaceholder="Rental Car Name"
            pricePlaceholder="Price Per Day"
          />
        </div>

      </div>

      <div className="admin-detail-page__right">
        <div className="admin-detail-panel">
          <SpecGrid specs={form.specs} onChange={updateSpecs} />
        </div>

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
            label={
              saving
                ? "Saving..."
                : isCreateMode
                ? "Create Rental Car"
                : "Update Rental Car"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default AdminRentalDetailPage;