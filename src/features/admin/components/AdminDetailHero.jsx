function AdminDetailHero({
  name,
  price,
  priceLabel = "THB",
  onChange,
  namePlaceholder = "Car Name",
  pricePlaceholder = "Price",
}) {
  return (
    <div className="admin-detail-hero">
      {/* Car Name */}
      <div className="admin-detail-field">
        <span className="admin-detail-field__label">Name</span>
        <input
          className="admin-detail-input title"
          value={name}
          placeholder={namePlaceholder}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      {/* Price + Badge */}
      <div className="admin-detail-field">
        <span className="admin-detail-field__label">Price</span>
        <div className="admin-price-row">
          <input
            className="admin-detail-input price"
            value={price}
            placeholder={pricePlaceholder}
            onChange={(e) => onChange("price", e.target.value)}
            type="number"
            min="0"
          />
          <div className="admin-price-badge">{priceLabel}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDetailHero;
