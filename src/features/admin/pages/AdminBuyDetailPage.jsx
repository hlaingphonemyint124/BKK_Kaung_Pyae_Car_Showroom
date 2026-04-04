import { useState } from "react";
import AdminImageUploader from "../components/AdminImageUploader";
import AdminDetailHero from "../components/AdminDetailHero";
import SpecGrid from "../components/SpecGrid";
import InfoRows from "../components/InfoRows";
import DocumentSection from "../components/DocumentSection";
import ConfirmBar from "../components/ConfirmBar";

function AdminBuyDetailPage() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: null,
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
  });

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
    console.log("SAVE BUY CAR", form);
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
          <AdminImageUploader
            image={form.image}
            onChange={(img) => updateField("image", img)}
          />
        </div>

        <div className="admin-detail-panel">
          <h3 className="admin-section-title">Car Info</h3>
          <AdminDetailHero
            name={form.name}
            price={form.price}
            onChange={updateField}
          />
        </div>

        <div className="admin-detail-panel">
          <SpecGrid specs={form.specs} onChange={updateSpecs} />
        </div>
      </div>

      <div className="admin-detail-page__right">
        <div className="admin-detail-panel">
          <InfoRows info={form.info} onChange={updateInfo} />
        </div>

        <div className="admin-detail-panel">
          <DocumentSection
            lines={form.documentLines}
            onChange={handleDocumentChange}
            onAddRow={handleAddRow}
            onDeleteRow={handleDeleteRow}
          />
        </div>

        <div className="admin-detail-panel admin-detail-panel--action">
          <ConfirmBar onClick={handleSubmit} label="Save Buy Car" />
        </div>
      </div>
    </div>
  );
}

export default AdminBuyDetailPage;