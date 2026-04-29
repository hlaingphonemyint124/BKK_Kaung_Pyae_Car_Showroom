import { useRef, useState, useEffect } from "react";

const MAX_PHOTOS = 20;

function AdminMediaUploader({ media = [], onChange }) {
  const inputRef = useRef(null);
  const [previewItem, setPreviewItem] = useState(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    const remaining = MAX_PHOTOS - media.length;
    if (remaining <= 0) {
      alert(`Maximum ${MAX_PHOTOS} photos per car. Remove some before adding more.`);
      return;
    }

    const allowed = validFiles.slice(0, remaining);
    if (allowed.length < validFiles.length) {
      alert(`Only ${allowed.length} photo(s) added — maximum is ${MAX_PHOTOS} per car.`);
    }

    const newItems = allowed.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      type: "image",
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    onChange([...media, ...newItems]);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const pastedFiles = [];

    for (const item of items) {
      const file = item.getAsFile?.();
      if (file && file.type.startsWith("image/")) {
        pastedFiles.push(file);
      }
    }

    handleFiles(pastedFiles);
  };

  const handleRemove = (id) => {
    const target = media.find((item) => item.id === id);

    if (target?.preview) {
      URL.revokeObjectURL(target.preview);
    }

    onChange(media.filter((item) => item.id !== id));

    if (previewItem?.id === id) {
      setPreviewItem(null);
    }
  };

  useEffect(() => {
    return () => {
      media.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [media]);

  return (
    <>
      <div
        className="admin-media-uploader"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onPaste={handlePaste}
        tabIndex={0}
      >
        {media.length === 0 ? (
          <div className="admin-media-uploader__empty">
            <p>Drag / Paste / Upload images</p>
            <p>At least one image is required.</p>
          </div>
        ) : (
          <div className="admin-media-uploader__grid">
            {media.map((item) => {
              const src = item.preview || item.url;

              return (
                <div
                  key={item.id}
                  className="admin-media-uploader__item"
                  onClick={() => setPreviewItem(item)}
                >
                  <img
                    src={src}
                    alt="preview"
                    className="admin-media-uploader__preview"
                  />

                  <button
                    type="button"
                    className="admin-media-uploader__remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            className="admin-media-uploader__upload-btn"
            onClick={() => inputRef.current?.click()}
            disabled={media.length >= MAX_PHOTOS}
          >
            Upload Images
          </button>
          <span style={{ fontSize: "11px", color: media.length >= MAX_PHOTOS ? "#ef2b2d" : "#888" }}>
            {media.length}/{MAX_PHOTOS}
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleInputChange}
        />
      </div>

      {previewItem && (
        <div
          className="admin-media-preview-modal"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="admin-media-preview-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="admin-media-preview-modal__close"
              onClick={() => setPreviewItem(null)}
            >
              ×
            </button>

            <img
              src={previewItem.preview || previewItem.url}
              alt="full preview"
              className="admin-media-preview-modal__media"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default AdminMediaUploader;