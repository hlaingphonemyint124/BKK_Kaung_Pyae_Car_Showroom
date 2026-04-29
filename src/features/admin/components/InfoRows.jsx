function InfoRows({ fields, values, onChange }) {
  return (
    <div className="admin-info-stack">
      {fields.map((field) => (
        <div className="admin-detail-field" key={field.key}>
          <span className="admin-detail-field__label">{field.label}</span>
          {field.type === "select" ? (
            <select
              className="admin-detail-input"
              value={String(values[field.key] ?? "")}
              onChange={(e) => onChange(field.key, e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="admin-detail-input"
              value={values[field.key] || ""}
              placeholder={field.placeholder || ""}
              readOnly={field.readOnly}
              onChange={(e) =>
                !field.readOnly && onChange(field.key, e.target.value)
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default InfoRows;
