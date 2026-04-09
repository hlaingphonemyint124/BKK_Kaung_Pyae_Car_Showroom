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
  getAdminCarById,
  updateAdminCar,
} from "../services/adminCarService";

const defaultDocumentLines = [
  { key: "Owner Name", value: "" },
  { key: "Registration Number", value: "" },
  { key: "Plate Number", value: "" },
  { key: "Transfer Status", value: "" },
  { key: "Tax Paid Until", value: "" },
  { key: "Insurance Status", value: "" },
];

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
    year: "",
    vin: "",
    rentPricePerDay: "",
    currencyCode: "THB",
    status: "available",
    isPublished: false,
    documents: "",
  },
  documentLines: defaultDocumentLines,
};

function AdminBuyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("AdminBuyDetailPage id =", id);
  
  const isCreateMode = !id;

  const [form, setForm] = useState(emptyBuyForm);
  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);

  const buyFields = [
    { key: "mileage", label: "Mileage" },
    { key: "year", label: "Year" },
    { key: "documents", label: "Documents" },
  ];
  

  useEffect(() => {
    const fetchCar = async () => {
      if (isCreateMode) {
        setForm(emptyBuyForm);
        setLoading(false);
        return;
      }

      if (!id) {
        console.error("Missing route id");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const car = await getAdminCarById(id);

        if (!car) {
          setForm(emptyBuyForm);
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
          price: car.sale_price ?? "",
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
            mileage: car.mileage_km ?? "",
            year: car.year ?? "",
            vin: car.vin ?? "",
            rentPricePerDay: car.rent_price_per_day ?? "",
            currencyCode: car.currency_code ?? "THB",
            status: car.status ?? "available",
            isPublished: Boolean(car.is_published),
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
        setForm(emptyBuyForm);
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
    setForm((prev) => {
      const newLines = [...prev.documentLines];
      newLines[index] = updatedLine;
      return {
        ...prev,
        documentLines: newLines,
      };
    });
  };

  const handleAddRow = () => {
    setForm((prev) => ({
      ...prev,
      documentLines: [...prev.documentLines, { key: "", value: "" }],
    }));
  };

  const handleDeleteRow = (index) => {
    setForm((prev) => ({
      ...prev,
      documentLines: prev.documentLines.filter((_, i) => i !== index),
    }));
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

    const payload = {
      brand,
      model,
      year: form.info.year ? Number(form.info.year) : null,
      mileage_km: form.info.mileage ? Number(form.info.mileage) : 0,
      sale_price: form.price ? Number(form.price) : 0,
      currency_code: form.info.currencyCode,
      status: form.info.status,
      is_published: form.info.isPublished,
    };

    try {
      setSaving(true);

      if (isCreateMode) {
        await createAdminCar(payload);
      } else {
        await updateAdminCar(id, payload);
      }

      navigate("/admin/buy");
    } catch (err) {
      console.error(err);
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
            currencyCode={form.info.currencyCode}
            onChange={(key, value) => {
              if (key === "currencyCode") {
                updateInfo("currencyCode", value);
              } else {
                updateField(key, value);
              }
            }}
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
            label={
              saving
                ? "Saving..."
                : isCreateMode
                ? "Save Buy Car"
                : "Update Buy Car"
            }
          />
        </div>
      </div>
    </div>
  );
}

export default AdminBuyDetailPage;