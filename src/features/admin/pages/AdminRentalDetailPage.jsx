import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/admin.css";

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
  deleteAdminCarImage,
  getRentalTerms,
  createRentalTerm,
  updateRentalTerm,
  deleteRentalTerm,
} from "../services/adminCarService";

const getDefaultTerms = () => [
  { id: null, text: "Driver must have a valid license." },
  { id: null, text: "Deposit may be required before pickup." },
  { id: null, text: "Late return may include extra charges." },
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
    year: new Date().getFullYear(),
    currencyCode: "THB",
    status: "available",
    isPublished: true,
    rent7: "",
    rent30: "",
    deposit: "",
  },
  terms: getDefaultTerms(),
});

function AdminRentalDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreateMode = !id;

  const deletedTermIds = useRef([]);
  const deletedImageIds = useRef([]);
  const originalTerms = useRef([]);

  const [form, setForm] = useState(getEmptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const rentalFields = [
    { key: "rent7", label: "7 Days (5% OFF)", readOnly: true },
    { key: "rent30", label: "30 Days (10% OFF)", readOnly: true },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "available", label: "Available" },
        { value: "rented", label: "Rented" },
        { value: "maintenance", label: "Maintenance" },
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
    const fetchAll = async () => {
      try {
        setLoading(true);
        deletedTermIds.current = [];
        deletedImageIds.current = [];

        const [termsData, car] = await Promise.all([
          getRentalTerms().catch(() => null),
          isCreateMode ? Promise.resolve(null) : getAdminCarById(id),
        ]);

        const rawTerms =
          termsData?.terms ||
          termsData?.data?.terms ||
          termsData?.data ||
          (Array.isArray(termsData) ? termsData : null);

        const mappedTerms =
          Array.isArray(rawTerms) && rawTerms.length > 0
            ? rawTerms.map((term) => ({
                id: term.id ?? null,
                text: term.description || term.title || "",
              }))
            : getDefaultTerms();

        originalTerms.current = mappedTerms.map((term) => ({ ...term }));

        if (isCreateMode || !car?.id) {
          setForm({
            ...getEmptyForm(),
            terms: mappedTerms,
          });
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

        const dailyPrice = Number(car.rent_price_per_day) || 0;

        setForm({
          name: `${car.brand || ""} ${car.model || ""}`.trim(),
          price: car.rent_price_per_day ?? "",
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
            rent7: dailyPrice
              ? Math.round(dailyPrice * 7 * 0.95).toString()
              : "",
            rent30: dailyPrice
              ? Math.round(dailyPrice * 30 * 0.9).toString()
              : "",
            deposit: "",
          },
          terms: mappedTerms,
        });
      } catch (err) {
        console.error("Failed to fetch rental data:", err);
        setForm(getEmptyForm());
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, isCreateMode]);

  useEffect(() => {
    const dailyPrice = Number(form.price) || 0;

    setForm((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        rent7: dailyPrice
          ? Math.round(dailyPrice * 7 * 0.95).toString()
          : "",
        rent30: dailyPrice
          ? Math.round(dailyPrice * 30 * 0.9).toString()
          : "",
      },
    }));
  }, [form.price]);

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
    if (key === "rent7" || key === "rent30") return;

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

  const handleTermChange = (index, text) => {
    setForm((prev) => {
      const updated = [...prev.terms];
      updated[index] = { ...updated[index], text };
      return { ...prev, terms: updated };
    });
  };

  const handleAddTerm = () => {
    setForm((prev) => ({
      ...prev,
      terms: [...prev.terms, { id: null, text: "" }],
    }));
  };

  const handleDeleteTerm = (index) => {
    const term = form.terms[index];

    if (term?.id && !deletedTermIds.current.includes(term.id)) {
      deletedTermIds.current.push(term.id);
    }

    setForm((prev) => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index),
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

  const saveTerms = async () => {
    const originalMap = new Map(
      originalTerms.current
        .filter((term) => term.id)
        .map((term) => [term.id, term.text])
    );

    const saves = form.terms
      .filter((term) => term.text.trim())
      .map((term, index) => {
        const payload = {
          title: term.text.trim(),
          description: term.text.trim(),
          sort_order: index,
        };

        if (!term.id) {
          return createRentalTerm(payload);
        }

        if (originalMap.get(term.id) !== term.text) {
          return updateRentalTerm(term.id, payload);
        }

        return Promise.resolve();
      });

    const deletes = deletedTermIds.current.map((termId) =>
      deleteRentalTerm(termId)
    );

    await Promise.all([...saves, ...deletes]);
    deletedTermIds.current = [];
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
      ...(form.info.mileage
        ? { mileage_km: Number(form.info.mileage) }
        : {}),
      ...(form.price
        ? { rent_price_per_day: Number(form.price) }
        : {}),
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

      await saveTerms().catch((err) => {
        console.error("Failed to save rental terms:", err);
      });

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
    <div className="ad-wrapper">
      <div className="ad-media-block">
        <AdminMediaUploader media={form.media} onChange={handleMediaChange} />
      </div>

      <div className="ad-name-bar">
        <div className="admin-detail-panel">
          <h3 className="admin-section-title">
            {isCreateMode ? "Rental Car Info" : "Edit Rental Car Info"}
          </h3>

          <AdminDetailHero
            name={form.name}
            price={form.price}
            priceLabel="THB/Day"
            onChange={(key, value) => updateField(key, value)}
            namePlaceholder="Rental Car Name"
            pricePlaceholder="Price Per Day"
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
              fields={rentalFields}
              values={form.info}
              onChange={updateInfo}
            />
          </div>
        </div>

        <div className="ad-shell__side">
          <div className="admin-detail-panel">
            <p className="admin-rental-note">
              Please read Terms and Conditions
            </p>

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
              disabled={saving}
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
    </div>
  );
}

export default AdminRentalDetailPage;