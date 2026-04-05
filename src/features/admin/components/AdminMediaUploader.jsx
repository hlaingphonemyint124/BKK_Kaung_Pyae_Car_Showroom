import { useRef, useState } from "react";

function AdminMediaUploader({ media = [], onChange }) {
  const inputRef = useRef(null);
  const [previewItem, setPreviewItem] = useState(null);

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);

    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length === 0) return;

    const newItems = validFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      type: file.type.startsWith("video/") ? "video" : "image",
      file,
      preview: URL.createObjectURL(file),
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
      if (
        file &&
        (file.type.startsWith("image/") || file.type.startsWith("video/"))
      ) {
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
            <p>Drag / Paste / Upload photos and videos</p>
            <p>At least one image is required. Video is optional.</p>
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
                  {item.type === "image" ? (
                    <img
                      src={src}
                      alt="preview"
                      className="admin-media-uploader__preview"
                    />
                  ) : (
                    <video
                      src={src}
                      className="admin-media-uploader__preview"
                      muted
                    />
                  )}

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

        <button
          type="button"
          className="admin-media-uploader__upload-btn"
          onClick={() => inputRef.current?.click()}
        >
          Upload Media
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
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

            {previewItem.type === "image" ? (
              <img
                src={previewItem.preview || previewItem.url}
                alt="full preview"
                className="admin-media-preview-modal__media"
              />
            ) : (
              <video
                src={previewItem.preview || previewItem.url}
                className="admin-media-preview-modal__media"
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminMediaUploader;