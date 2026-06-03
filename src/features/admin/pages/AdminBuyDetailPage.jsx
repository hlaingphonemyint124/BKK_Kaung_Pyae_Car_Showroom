import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/admin.css";

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
  deleteAdminCarImage,
  getCarDocuments,
  createCarDocument,
  updateCarDocument,
  deleteCarDocument,
} from "../services/adminCarService";

const getDefaultDocumentLines = () => [
  { id: null, key: "Owner Name", value: "" },
  { id: null, key: "Registration Number", value: "" },
  { id: null, key: "Plate Number", value: "" },
  { id: null, key: "Transfer Status", value: "" },
  { id: null, key: "Tax Paid Until", value: "" },
  { id: null, key: "Insurance Status", value: "" },
];

const getEmptyForm = () => ({
  name: "",
  price: "",
  media: [],
  specs: {
    body_type: "",
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
    currencyCode: "THB",
    status: "available",
    isPublished: true,
  },
  documentLines: getDefaultDocumentLines(),
});

function AdminBuyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreateMode = !id;

  const deletedDocumentIds = useRef([]);
  const deletedImageIds = useRef([]);

  const [form, setForm] = useState(getEmptyForm);
  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);

  const buyFields = [
    { key: "mileage", label: "Mileage" },
    { key: "year", label: "Year" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "available", label: "Available" },
        { value: "reserved", label: "Reserved" },
        { value: "sold", label: "Sold" },
      ],
    },
    {
      key: "isPublished",
      label: "Published",
      type: "select",
      options: [
        { value: "true", label: "Yes — Visible in Shop" },
        { value: "false", label: "No — Hidden" },
      ],
    },
  ];

  useEffect(() => {
    deletedDocumentIds.current = [];
    deletedImageIds.current = [];

    if (isCreateMode) {
      setForm(getEmptyForm());
      setLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        setLoading(true);

        const [car, docsData] = await Promise.all([
          getAdminCarById(id),
          getCarDocuments(id).catch(() => null),
        ]);

        if (!car?.id) {
          setForm(getEmptyForm());
          return;
        }

        const media =
          car.images?.map((img) => ({
            id: `existing-${img.id}`,
            imageId: img.id,
            url:
              img.storage_path ||
              img.url ||
              img.secure_url ||
              img.image_url ||
              "",
            storage_path: img.storage_path,
            secure_url: img.secure_url,
            type: "image",
            isPrimary: Boolean(img.is_primary),
            sortOrder: img.sort_order ?? 0,
            isExisting: true,
            isNew: false,
          })) || [];

        const rawDocs =
          docsData?.documents ||
          docsData?.data?.documents ||
          docsData?.data ||
          car.documents ||
          (Array.isArray(docsData) ? docsData : null);

        const documentLines =
          Array.isArray(rawDocs) && rawDocs.length > 0
            ? rawDocs.map((doc) => ({
                id: doc.id ?? null,
                key: doc.field_name ?? "",
                value: doc.field_value ?? "",
              }))
            : getDefaultDocumentLines();

        setForm({
          name: `${car.brand || ""} ${car.model || ""}`.trim(),
          price: car.sale_price ?? "",
          media,
          specs: {
            body_type: car.body_type || "",
            fuel: car.fuel || car.fuel_type || "",
            transmission: car.transmission || "",
            color: car.color || "",
            engine: car.engine || "",
            drive: car.drive || car.drive_type || "",
            seats: car.seats ? String(car.seats) : "",
          },
          info: {
            mileage: car.mileage_km ?? "",
            year: car.year ?? "",
            currencyCode: car.currency_code ?? "THB",
            status: car.status ?? "available",
            isPublished: Boolean(car.is_published),
          },
          documentLines,
        });
      } catch (err) {
        console.error("Failed to fetch car:", err);
        setForm(getEmptyForm());
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
        [key]:
          key === "isPublished"
            ? value === "true" || value === true
            : value,
      },
    }));
  };

  const handleMediaChange = (newMedia) => {
    const removedExistingImages = form.media.filter(
      (oldItem) =>
        oldItem.isExisting &&
        !newMedia.some((newItem) => newItem.id === oldItem.id)
    );

    removedExistingImages.forEach((img) => {
      const imageId = img.imageId || String(img.id).replace("existing-", "");

      if (imageId && !deletedImageIds.current.includes(imageId)) {
        deletedImageIds.current.push(imageId);
      }
    });

    updateField("media", newMedia);
  };

  const handleDocumentChange = (index, updatedLine) => {
    setForm((prev) => {
      const newLines = [...prev.documentLines];
      newLines[index] = updatedLine;
      return { ...prev, documentLines: newLines };
    });
  };

  const handleAddRow = () => {
    setForm((prev) => ({
      ...prev,
      documentLines: [...prev.documentLines, { id: null, key: "", value: "" }],
    }));
  };

  const handleDeleteRow = (index) => {
    const target = form.documentLines[index];

    if (target?.id && !deletedDocumentIds.current.includes(target.id)) {
      deletedDocumentIds.current.push(target.id);
    }

    setForm((prev) => ({
      ...prev,
      documentLines: prev.documentLines.filter((_, i) => i !== index),
    }));
  };

  const deleteRemovedImages = async (carId) => {
    for (const imageId of deletedImageIds.current) {
      await deleteAdminCarImage(carId, imageId);
    }

    deletedImageIds.current = [];
  };

  const uploadNewImages = async (carId) => {
    const existingImages = form.media.filter((item) => item.isExisting);

    const hasExistingPrimary = existingImages.some(
      (item) => item.isPrimary || item.is_primary
    );

    const usedSortOrders = existingImages
      .map((item) => Number(item.sortOrder ?? item.sort_order ?? 0))
      .filter((num) => !Number.isNaN(num));

    let nextSortOrder =
      usedSortOrders.length > 0 ? Math.max(...usedSortOrders) + 1 : 0;

    const newItems = form.media.filter(
      (item) => item.isNew && item.type === "image" && item.file instanceof File
    );

    for (let i = 0; i < newItems.length; i += 1) {
      await addAdminCarImage(carId, newItems[i].file, {
        isPrimary:
          !hasExistingPrimary && existingImages.length === 0 && i === 0,
        sortOrder: nextSortOrder,
      });

      nextSortOrder += 1;
    }
  };

  const saveDocuments = async (carId) => {
    const documents = form.documentLines
      .filter((line) => line.key.trim() && line.value.trim())
      .map((line, index) => ({
        id: line.id,
        field_name: line.key.trim(),
        field_value: line.value.trim(),
        sort_order: index,
      }));

    for (const documentId of deletedDocumentIds.current) {
      await deleteCarDocument(carId, documentId);
    }

    for (const doc of documents) {
      const payload = {
        field_name: doc.field_name,
        field_value: doc.field_value,
        sort_order: doc.sort_order,
      };

      if (doc.id) {
        await updateCarDocument(carId, doc.id, payload);
      } else {
        await createCarDocument(carId, payload);
      }
    }

    deletedDocumentIds.current = [];
  };

  const handleSubmit = async () => {
    if (saving) return;

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

    if (isCreateMode && !form.info.year) {
      alert("Please enter the car year.");
      return;
    }

    const imageCount = form.media.filter((item) => item.type === "image").length;

    if (imageCount === 0) {
      alert("Please add at least one image.");
      return;
    }

    const payload = {
      listing_type: "sale",
      brand,
      model,
      ...(form.info.year ? { year: Number(form.info.year) } : {}),
      ...(form.info.mileage
        ? { mileage_km: Number(form.info.mileage) }
        : {}),
      ...(form.price ? { sale_price: Number(form.price) } : {}),
      currency_code: form.info.currencyCode,
      status: form.info.status,
      is_published: form.info.isPublished,
      ...(form.specs.body_type ? { body_type: form.specs.body_type } : {}),
      ...(form.specs.fuel ? { fuel: form.specs.fuel } : {}),
      ...(form.specs.transmission
        ? { transmission: form.specs.transmission }
        : {}),
      ...(form.specs.color ? { color: form.specs.color } : {}),
      ...(form.specs.engine ? { engine: form.specs.engine } : {}),
      ...(form.specs.drive ? { drive: form.specs.drive } : {}),
      ...(form.specs.seats ? { seats: Number(form.specs.seats) } : {}),
    };

    try {
      setSaving(true);

      const savedCar = isCreateMode
        ? await createAdminCar(payload)
        : await updateAdminCar(id, payload);

      const carId = savedCar?.car?.id || savedCar?.id || id;

      if (!carId) {
        throw new Error("Missing car id after save.");
      }

      await deleteRemovedImages(carId);
      await uploadNewImages(carId);
      await saveDocuments(carId);

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
    <div className="ad-wrapper">
      <div className="ad-media-block">
        <AdminMediaUploader media={form.media} onChange={handleMediaChange} />
      </div>

      <div className="ad-name-bar">
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

      <div className="ad-specs-row">
        <SpecGrid specs={form.specs} onChange={updateSpecs} />
      </div>

      <div className="ad-shell">
        <div className="ad-shell__main">
          <div className="admin-detail-panel">
            <InfoRows
              fields={buyFields}
              values={form.info}
              onChange={updateInfo}
            />
          </div>
        </div>

        <div className="ad-shell__side">
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
              disabled={saving}
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
    </div>
  );
}

export default AdminBuyDetailPage;