import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminMediaUploader from "../components/AdminMediaUploader";
import AdminDetailHero from "../components/AdminDetailHero";
import SpecGrid from "../components/SpecGrid";
import InfoRows from "../components/InfoRows";
import DocumentSection from "../components/DocumentSection";
import ConfirmBar from "../components/ConfirmBar";
import mockAdminCars from "../data/mockAdminCars";

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
  const { id } = useParams();
  const isCreateMode = id === "new";

  const [form, setForm] = useState(emptyBuyForm);

  const buyFields = [
    { key: "mileage", label: "Mileage" },
    { key: "model", label: "Year" },
    { key: "documents", label: "Documents" },
  ];

  useEffect(() => {
    if (isCreateMode) {
      setForm(emptyBuyForm);
      return;
    }

    const car = mockAdminCars.find((item) => String(item.id) === String(id));

    if (!car) return;

    setForm({
      name: car.name || "",
      price: car.buy?.price || "",
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
        mileage: car.mileage || "",
        model: car.year || "",
        documents: car.buy?.documents || "",
      },
      documentLines: [
        { key: "Owner Name", value: "" },
        { key: "Registration Number", value: "" },
        { key: "Plate Number", value: car.specs?.plate || "" },
        { key: "Transfer Status", value: car.buy?.documents || "" },
        { key: "Tax Paid Until", value: "" },
        { key: "Insurance Status", value: "" },
      ],
    });
  }, [id, isCreateMode]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSpecs = (key, value) => {
    setForm((prev) => ({
      ...prev,
      specs: { ...prev.specs, [key]: value },
    }));
  };

  const updateInfo = (key, value) => {
    setForm((prev) => ({
      ...prev,
      info: { ...prev.info, [key]: value },
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

    console.log(isCreateMode ? "CREATE BUY CAR" : "UPDATE BUY CAR", form);
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
            label={isCreateMode ? "Save Buy Car" : "Update Buy Car"}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminBuyDetailPage;