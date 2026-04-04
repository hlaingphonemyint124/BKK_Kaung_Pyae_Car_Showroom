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
    documentLines: ["", "", "", "", ""],
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

  return (
    <div className="admin-detail-page">

      {/* IMAGE */}
      <AdminImageUploader
        image={form.image}
        onChange={(img) => updateField("image", img)}
      />

      {/* TITLE + PRICE */}
      <AdminDetailHero
        name={form.name}
        price={form.price}
        onChange={updateField}
      />

      {/* SPECS */}
      <SpecGrid specs={form.specs} onChange={updateSpecs} />

      {/* INFO ROWS */}
      <InfoRows info={form.info} onChange={updateInfo} />

      {/* DOCUMENT */}
      <DocumentSection
        lines={form.documentLines}
        onChange={(index, value) => {
          const newLines = [...form.documentLines];
          newLines[index] = value;
          updateField("documentLines", newLines);
        }}
      />

      {/* BUTTON */}
      <ConfirmBar onClick={handleSubmit} label="Save Buy Car" />
    </div>
  );
}

export default AdminBuyDetailPage;