import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminMediaUploader from "../components/AdminMediaUploader";
import AdminDetailHero from "../components/AdminDetailHero";
import SpecGrid from "../components/SpecGrid";
import InfoRows from "../components/InfoRows";
import DocumentSection from "../components/DocumentSection";
import ConfirmBar from "../components/ConfirmBar";
import {
  createAdminCar,
  getAdminCars,
  updateAdminCar,
} from "../services/adminCarService";

const emptyBuyForm = {
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
    mileage: "",
    model: "",
    documents: "",
  },
  documentLines: [
    { key: "Owner Name", value: "" },
    { key: "Registration Number", value: "" },
    { key: "Plate Number", value: "" },
    { key: "Transfer Status", value: "" },
    { key: "Tax Paid Until", value: "" },
    { key: "Insurance Status", value: "" },
  ],
};

function AdminBuyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreateMode = id === "new";

  const [form, setForm] = useState(emptyBuyForm);
  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const buyFields = [
    { key: "mileage", label: "Mileage" },
    { key: "model", label: "Year" },
    { key: "documents", label: "Documents" },
  ];

  useEffect(() => {
    const fetchCar = async () => {
      if (isCreateMode) {
        setForm(emptyBuyForm);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminCars();
        const carList = data?.cars || data?.data?.cars || data?.data || [];

        const car = carList.find((item) => String(item.id) === String(id));

        if (!car) {
          setError("Car not found.");
          setLoading(false);
          return;
        }

        const primaryImage =
          car.primary_image ||
          car.image ||
          car.images?.find((img) => img.is_primary)?.storage_path ||
          car.images?.[0]?.storage_path ||
          "";

        setForm({
          name: `${car.brand || ""} ${car.model || ""}`.trim(),
          price: car.sale_price || "",
          media: primaryImage
            ? [
                {
                  id: `existing-${car.id}`,
                  url: primaryImage,
                  type: "image",
                },
              ]
            : [],
          specs: {
            fuel: car.fuel_type || car.fuel || "",
            transmission: car.transmission || "",
            color: car.color || "",
            engine: car.engine || "",
            drive: car.drive_type || car.drive || "",
            seats: car.seats || "",
          },
          info: {
            mileage: car.mileage || "",
            model: car.year || "",
            documents: car.documents || "",
          },
          documentLines: [
            { key: "Owner Name", value: car.owner_name || "" },
            { key: "Registration Number", value: car.registration_number || "" },
            { key: "Plate Number", value: car.plate_number || "" },
            { key: "Transfer Status", value: car.transfer_status || "" },
            { key: "Tax Paid Until", value: car.tax_paid_until || "" },
            { key: "Insurance Status", value: car.insurance_status || "" },
          ],
        });
      } catch (err) {
        console.error("Failed to fetch car:", err);
        setError(err.response?.data?.error || "Failed to load car.");
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, isCreateMode]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

  const handleDocumentChange = (index, updatedLine) => {
    const newLines = [...form.documentLines];
    newLines[index] = updatedLine;

    setForm((prev) => ({
      ...prev,
      documentLines: newLines,
    }));
  };

  const handleAddRow = () => {
    setForm((prev) => ({
      ...prev,
      documentLines: [...prev.documentLines, { key: "", value: "" }],
    }));
  };

  const handleDeleteRow = (index) => {
    const newLines = form.documentLines.filter((_, i) => i !== index);

    setForm((prev) => ({
      ...prev,
      documentLines: newLines,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      alert("Please enter car name.");
      return;
    }

    if (!form.price) {
      alert("Please enter sale price.");
      return;
    }

    const hasImage = form.media.some((item) => item.type === "image");
    if (!hasImage) {
      alert("Please upload at least one image.");
      return;
    }

    const [brand = "", ...modelParts] = form.name.trim().split(" ");
    const model = modelParts.join(" ");

    const payload = {
      brand,
      model,
      sale_price: Number(form.price) || 0,
      rent_price_per_day: 0,
      status: "available",
      fuel_type: form.specs.fuel || null,
      transmission: form.specs.transmission || null,
      color: form.specs.color || null,
      engine: form.specs.engine || null,
      drive_type: form.specs.drive || null,
      seats: Number(form.specs.seats) || null,
      mileage: Number(form.info.mileage) || null,
      year: Number(form.info.model) || null,
    };

    try {
      setSaving(true);
      setError("");

      if (isCreateMode) {
        await createAdminCar(payload);
        alert("Buy car created successfully.");
      } else {
        await updateAdminCar(id, payload);
        alert("Buy car updated successfully.");
      }

      navigate("/admin/buy");
    } catch (err) {
      console.error("Failed to save car:", err);
      setError(err.response?.data?.error || "Failed to save car.");
      alert(err.response?.data?.error || "Failed to save car.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="admin-state-message">Loading car details...</p>;
  }

  return (
    <div className="admin-detail-page">
      {error && (
        <p className="admin-state-message admin-state-message--error">
          {error}
        </p>
      )}

      <div className="admin-detail-page__left">
        <div className="admin-detail-panel">
          <AdminMediaUploader
            media={form.media}
            onChange={(newMedia) => updateField("media", newMedia)}
          />
        </div>

        <div className="admin-detail-panel">
          <h3 className="admin-section-title">
            {isCreateMode ? "Car Info" : "Edit Car Info"}
          </h3>

          <AdminDetailHero
            name={form.name}
            price={form.price}
            onChange={updateField}
            namePlaceholder="Car Name"
            pricePlaceholder="Sale Price"
          />
        </div>

        <div className="admin-detail-panel">
          <SpecGrid specs={form.specs} onChange={updateSpecs} />
        </div>
      </div>

      <div className="admin-detail-page__right">
        <div className="admin-detail-panel">
          <InfoRows
            fields={buyFields}
            values={form.info}
            onChange={updateInfo}
          />
        </div>

        <div className="admin-detail-panel">
          <DocumentSection
            title="Car Document Information"
            lines={form.documentLines}
            onChange={handleDocumentChange}
            onAddRow={handleAddRow}
            onDeleteRow={handleDeleteRow}
          />
        </div>

        <div className="admin-detail-panel admin-detail-panel--action">
          <ConfirmBar
            onClick={handleSubmit}
            label={saving ? "Saving..." : isCreateMode ? "Save Buy Car" : "Update Buy Car"}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminBuyDetailPage;