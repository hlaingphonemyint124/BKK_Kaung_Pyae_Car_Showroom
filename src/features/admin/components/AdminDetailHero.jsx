function AdminDetailHero({
  name,
  price,
  currencyCode = "THB",
  onChange,
  namePlaceholder = "Car Name",
  pricePlaceholder = "Price",
}) {
  return (
    <div className="admin-detail-hero">
      {/* Car Name */}
      <input
        className="admin-detail-input title"
        value={name}
        placeholder={namePlaceholder}
        onChange={(e) => onChange("name", e.target.value)}
      />

      {/* Price + Currency */}
      <div className="admin-price-row">
        <input
          className="admin-detail-input price"
          value={price}
          placeholder={pricePlaceholder}
          onChange={(e) => onChange("price", e.target.value)}
        />

        <select
          className="admin-currency-select"
          value={currencyCode}
          onChange={(e) => onChange("currencyCode", e.target.value)}
        >
          <option value="THB">THB</option>
          <option value="USD">USD</option>
          <option value="MMK">MMK</option>
        </select>
      </div>
    </div>
  );
}

export default AdminDetailHero;