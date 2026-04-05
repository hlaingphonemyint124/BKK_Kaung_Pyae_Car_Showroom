function InfoRows({ fields, values, onChange }) {
  return (
    <div className="admin-info-rows">
      {fields.map((field) => (
        <div className="row" key={field.key}>
          <span>{field.label}</span>
          <input
            value={values[field.key] || ""}
            placeholder={field.placeholder || ""}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}

export default InfoRows;