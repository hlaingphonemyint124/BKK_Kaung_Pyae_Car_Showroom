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
  addAdminCarImage,
  getCarDocuments,
  saveCarDocuments,
} from "../services/adminCarService";

const DEFAULT_DOCUMENT_LINES = [
  { id: null, key: "Owner Name",           value: "" },
  { id: null, key: "Registration Number",  value: "" },
  { id: null, key: "Plate Number",         value: "" },
  { id: null, key: "Transfer Status",      value: "" },
  { id: null, key: "Tax Paid Until",       value: "" },
  { id: null, key: "Insurance Status",     value: "" },
];

const EMPTY_FORM = {
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
    currencyCode: "THB",
    status: "available",
    isPublished: false,
  },
  documentLines: DEFAULT_DOCUMENT_LINES,
};

function AdminBuyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreateMode = !id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);

  const buyFields = [
    { key: "mileage", label: "Mileage" },
    { key: "year",    label: "Year"    },
    { key: "vin",     label: "VIN"     },
  ];

  useEffect(() => {
    if (isCreateMode) {
      setForm(EMPTY_FORM);
      setLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        setLoading(true);

        // Fetch car data and documents in parallel
        const [car, docsData] = await Promise.all([
          getAdminCarById(id),
          getCarDocuments(id).catch(() => null),
        ]);

        if (!car) {
          setForm(EMPTY_FORM);
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

        // Map documents from API or fall back to defaults
        const rawDocs =
          docsData?.documents ||
          docsData?.data?.documents ||
          docsData?.data ||
          (Array.isArray(docsData) ? docsData : null);

        const documentLines =
          rawDocs?.length > 0
            ? rawDocs.map((doc) => ({
                id: doc.id ?? null,
                key: doc.field_name ?? "",
                value: doc.field_value ?? "",
              }))
            : DEFAULT_DOCUMENT_LINES;

        setForm({
          name: `${car.brand || ""} ${car.model || ""}`.trim(),
          price: car.sale_price ?? "",
          media,
          specs: {
            // migration 012: columns are fuel / drive (not fuel_type / drive_type)
            fuel:         car.fuel         || car.fuel_type  || "",
            transmission: car.transmission || "",
            color:        car.color        || "",
            engine:       car.engine       || "",
            drive:        car.drive        || car.drive_type || "",
            // seats is INTEGER in DB — store as string for the select
            seats: car.seats ? String(car.seats) : "",
          },
          info: {
            mileage:      car.mileage_km   ?? "",
            year:         car.year         ?? "",
            vin:          car.vin          ?? "",
            currencyCode: car.currency_code ?? "THB",
            status:       car.status       ?? "available",
            isPublished:  Boolean(car.is_published),
          },
          documentLines,
        });
      } catch (err) {
        console.error("Failed to fetch car:", err);
        setForm(EMPTY_FORM);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id, isCreateMode]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateSpecs = (key, value) =>
    setForm((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));

  const updateInfo = (key, value) =>
    setForm((prev) => ({ ...prev, info: { ...prev.info, [key]: value } }));

  const handleDocumentChange = (index, updatedLine) =>
    setForm((prev) => {
      const newLines = [...prev.documentLines];
      newLines[index] = updatedLine;
      return { ...prev, documentLines: newLines };
    });

  const handleAddRow = () =>
    setForm((prev) => ({
      ...prev,
      documentLines: [...prev.documentLines, { id: null, key: "", value: "" }],
    }));

  const handleDeleteRow = (index) =>
    setForm((prev) => ({
      ...prev,
      documentLines: prev.documentLines.filter((_, i) => i !== index),
    }));

  const uploadNewImages = async (carId) => {
    const newItems = form.media.filter(
      (item) => item.isNew && item.type === "image" && item.file
    );
    for (let i = 0; i < newItems.length; i++) {
      await addAdminCarImage(carId, newItems[i].file, {
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
    const imageCount = form.media.filter((item) => item.type === "image").length;
    if (imageCount === 0) {
      alert("Please add at least one image.");
      return;
    }

    // Build payload — specs included (migration 012 columns)
    const payload = {
      brand,
      model,
      year:         form.info.year    ? Number(form.info.year)    : null,
      mileage_km:   form.info.mileage ? Number(form.info.mileage) : 0,
      sale_price:   form.price        ? Number(form.price)        : 0,
      currency_code: form.info.currencyCode,
      status:       form.info.status,
      is_published: form.info.isPublished,
      vin:          form.info.vin || undefined,
      // Specs (migration 012)
      fuel:         form.specs.fuel         || null,
      transmission: form.specs.transmission || null,
      color:        form.specs.color        || null,
      engine:       form.specs.engine       || null,
      drive:        form.specs.drive        || null,
      seats:        form.specs.seats        ? Number(form.specs.seats) : null,
    };

    try {
      setSaving(true);

      const savedCar = isCreateMode
        ? await createAdminCar(payload)
        : await updateAdminCar(id, payload);

      const carId = savedCar?.car?.id || savedCar?.id || id;
      if (!carId) throw new Error("Missing car id after save.");

      // Upload new images
      await uploadNewImages(carId);

      // Save documents (migration 014) — replace all
      const documents = form.documentLines
        .filter((line) => line.key.trim())
        .map((line, i) => ({
          field_name:  line.key,
          field_value: line.value,
          sort_order:  i,
        }));
      await saveCarDocuments(carId, documents).catch((err) =>
        console.error("Failed to save documents:", err)
      );

      navigate("/admin/buy");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || err.message || "Failed to save car.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="admin-state-message">Loading car details...</p>;
  }

  return (
    <div className="admin-detail-shell">
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
            priceLabel="THB"
            onChange={(key, value) => updateField(key, value)}
          />
        </div>
      </div>

      <div className="admin-detail-page__right">
        <div className="admin-detail-panel">
          <SpecGrid specs={form.specs} onChange={updateSpecs} />
        </div>

        <div className="admin-detail-panel">
          <InfoRows fields={buyFields} values={form.info} onChange={updateInfo} />
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
