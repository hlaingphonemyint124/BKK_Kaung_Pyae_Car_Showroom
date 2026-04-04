function InfoRows({ info, onChange }) {
  return (
    <div className="admin-info-rows">
      <div className="row">
        <span>Mileage</span>
        <input
          value={info.mileage}
          onChange={(e) => onChange("mileage", e.target.value)}
        />
      </div>

      <div className="row">
        <span>Model</span>
        <input
          value={info.model}
          onChange={(e) => onChange("model", e.target.value)}
        />
      </div>

      <div className="row">
        <span>Documents</span>
        <input
          value={info.documents}
          onChange={(e) => onChange("documents", e.target.value)}
        />
      </div>
    </div>
  );
}

export default InfoRows;