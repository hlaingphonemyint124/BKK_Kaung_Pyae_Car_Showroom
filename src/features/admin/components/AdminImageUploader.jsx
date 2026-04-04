import { useRef } from "react";

function AdminImageUploader({ image, onChange }) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const preview = URL.createObjectURL(file);

    onChange({
      file,
      preview,
    });
  };

  const handleInput = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.startsWith("image/")) {
        handleFile(item.getAsFile());
      }
    }
  };

  return (
    <div
      className="admin-image-uploader"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste}
      tabIndex={0}
    >
      {image?.preview || image ? (
        <img
          src={image?.preview || image}
          className="admin-image-uploader__img"
          alt="preview"
        />
      ) : (
        <div className="admin-image-uploader__placeholder">
          Drag / Paste / Upload Image
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current.click()}
        className="admin-image-uploader__btn"
      >
        Upload
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleInput}
      />
    </div>
  );
}

export default AdminImageUploader;