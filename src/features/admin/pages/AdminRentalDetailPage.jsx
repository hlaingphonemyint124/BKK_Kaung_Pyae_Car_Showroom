import { useEffect, useRef, useState } from "react";
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
  getRentalTerms,
  createRentalTerm,
  updateRentalTerm,
  deleteRentalTerm,
} from "../services/adminCarService";

// terms are { id: string|null, text: string }
const DEFAULT_TERMS = [
  { id: null, text: "Driver must have a valid license." },
  { id: null, text: "Deposit may be required before pickup." },
  { id: null, text: "Late return may include extra charges." },
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
    mileage: 0,
    year: new Date().getFullYear(),
    currencyCode: "THB",
    status: "available",
    isPublished: true,
    rent7: "",
    rent30: "",
    deposit: "",
  },
  terms: DEFAULT_TERMS,
};

function AdminRentalDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isCreateMode = !id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Track IDs of terms deleted during this session so we can DELETE them on save
  const deletedTermIds = useRef([]);

  // Keep a snapshot of the terms loaded from the API for diffing on save
  const originalTerms = useRef([]);

  const rentalFields = [
    { key: "rent7",   label: "7 Days (5% OFF)",   readOnly: true },
    { key: "rent30",  label: "30 Days (10% OFF)",  readOnly: true },
    { key: "deposit", label: "Deposit",            placeholder: "Optional" },
    {
      key: "isPublished",
      label: "Published",
      type: "select",
      options: [
        { value: "true",  label: "Yes — Visible in Shop" },
        { value: "false", label: "No — Hidden"           },
      ],
    },
  ];

  // Load car data + global rental terms in parallel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        deletedTermIds.current = [];

        const [termsData, car] = await Promise.all([
          getRentalTerms().catch(() => null),
          isCreateMode ? Promise.resolve(null) : getAdminCarById(id),
        ]);

        // Map API rental terms → { id, text }
        const rawTerms =
          termsData?.terms ||
          termsData?.data?.terms ||
          termsData?.data ||
          (Array.isArray(termsData) ? termsData : null);

        const mappedTerms =
          rawTerms?.length > 0
            ? rawTerms.map((t) => ({
                id: t.id ?? null,
                text: t.description || t.title || "",
              }))
            : DEFAULT_TERMS;

        originalTerms.current = mappedTerms.map((t) => ({ ...t }));

        if (isCreateMode || !car?.id) {
          setForm({ ...EMPTY_FORM, terms: mappedTerms });
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
            fuel:         car.fuel         || car.fuel_type  || "",
            transmission: car.transmission || "",
            color:        car.color        || "",
            engine:       car.engine       || "",
            drive:        car.drive        || car.drive_type || "",
            seats:        car.seats        ? String(car.seats) : "",
          },
          info: {
            mileage:      car.mileage_km   ?? "",
            year:         car.year         ?? "",
            currencyCode: car.currency_code ?? "THB",
            status:       car.status       ?? "available",
            isPublished:  Boolean(car.is_published),
            rent7:  dailyPrice ? Math.round(dailyPrice * 7  * 0.95).toString() : "",
            rent30: dailyPrice ? Math.round(dailyPrice * 30 * 0.90).toString() : "",
            deposit: "",
          },
          terms: mappedTerms,
        });
      } catch (err) {
        console.error("Failed to fetch rental data:", err);
        setForm(EMPTY_FORM);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id, isCreateMode]);

  // Auto-calculate discount prices whenever daily price changes
  useEffect(() => {
    const dailyPrice = Number(form.price) || 0;
    setForm((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        rent7:  dailyPrice ? Math.round(dailyPrice * 7  * 0.95).toString() : "",
        rent30: dailyPrice ? Math.round(dailyPrice * 30 * 0.90).toString() : "",
      },
    }));
  }, [form.price]);

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateSpecs = (key, value) =>
    setForm((prev) => ({ ...prev, specs: { ...prev.specs, [key]: value } }));

  const updateInfo = (key, value) => {
    if (key === "rent7" || key === "rent30") return;
    setForm((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        [key]: key === "isPublished" ? value === "true" || value === true : value,
      },
    }));
  };

  // onChange for RentalTermsSection: receives (index, newText)
  const handleTermChange = (index, text) =>
    setForm((prev) => {
      const updated = [...prev.terms];
      updated[index] = { ...updated[index], text };
      return { ...prev, terms: updated };
    });

  const handleAddTerm = () =>
    setForm((prev) => ({
      ...prev,
      terms: [...prev.terms, { id: null, text: "" }],
    }));

  const handleDeleteTerm = (index) => {
    const term = form.terms[index];
    if (term.id) {
      deletedTermIds.current = [...deletedTermIds.current, term.id];
    }
    setForm((prev) => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index),
    }));
  };

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

  // Diff and save rental terms via CRUD endpoints
  const saveTerms = async () => {
    const originalMap = new Map(
      originalTerms.current.filter((t) => t.id).map((t) => [t.id, t.text])
    );

    const saves = form.terms
      .filter((t) => t.text.trim())
      .map((t, i) => {
        if (!t.id) {
          // New term — create
          return createRentalTerm({
            title: t.text,
            description: t.text,
            sort_order: i,
          });
        }
        // Existing — update only if text changed
        if (originalMap.get(t.id) !== t.text) {
          return updateRentalTerm(t.id, {
            title: t.text,
            description: t.text,
            sort_order: i,
          });
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

    // Build payload — omit undefined fields so Zod .optional() is satisfied
    const payload = {
      brand,
      model,
      year:               Number(form.info.year) || new Date().getFullYear(),
      ...(form.info.mileage  ? { mileage_km:         Number(form.info.mileage) } : {}),
      ...(form.price         ? { rent_price_per_day: Number(form.price)        } : {}),
      currency_code:      form.info.currencyCode,
      status:             form.info.status,
      is_published:       form.info.isPublished,
      ...(form.specs.fuel        ? { fuel:         form.specs.fuel }          : {}),
      ...(form.specs.transmission? { transmission: form.specs.transmission }  : {}),
      ...(form.specs.color       ? { color:        form.specs.color }         : {}),
      ...(form.specs.engine      ? { engine:       form.specs.engine }        : {}),
      ...(form.specs.drive       ? { drive:        form.specs.drive }         : {}),
      ...(form.specs.seats       ? { seats:        Number(form.specs.seats) } : {}),
    };

    try {
      setSaving(true);

      const savedCar = isCreateMode
        ? await createAdminCar(payload)
        : await updateAdminCar(id, payload);

      const carId = savedCar?.car?.id || savedCar?.id || id;
      if (!carId) throw new Error("Missing car id after save.");

      await uploadNewImages(carId);

      // Save rental terms (migration 013) — graceful failure
      await saveTerms().catch((err) =>
        console.error("Failed to save rental terms:", err)
      );

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

      <div className="admin-detail-page__right">
        <div className="admin-detail-panel">
          <SpecGrid specs={form.specs} onChange={updateSpecs} />
        </div>

        <div className="admin-detail-panel">
          <InfoRows fields={rentalFields} values={form.info} onChange={updateInfo} />
        </div>

        <div className="admin-detail-panel">
          <p className="admin-rental-note">Please read Terms and Conditions</p>
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
