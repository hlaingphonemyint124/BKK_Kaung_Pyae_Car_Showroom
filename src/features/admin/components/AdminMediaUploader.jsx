import { useRef } from "react";

function AdminMediaUploader({ media = [], onChange }) {
  const inputRef = useRef(null);

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
    if (target?.preview) URL.revokeObjectURL(target.preview);

    onChange(media.filter((item) => item.id !== id));
  };

  return (
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
          <p>You can upload multiple images and video files</p>
        </div>
      ) : (
        <div className="admin-media-uploader__grid">
          {media.map((item) => (
            <div key={item.id} className="admin-media-uploader__item">
              {item.type === "image" ? (
                <img
                  src={item.preview}
                  alt="preview"
                  className="admin-media-uploader__preview"
                />
              ) : (
                <video
                  src={item.preview}
                  className="admin-media-uploader__preview"
                  controls
                />
              )}

              <button
                type="button"
                className="admin-media-uploader__remove"
                onClick={() => handleRemove(item.id)}
              >
                ×
              </button>
            </div>
          ))}
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
  );
}

export default AdminMediaUploader;