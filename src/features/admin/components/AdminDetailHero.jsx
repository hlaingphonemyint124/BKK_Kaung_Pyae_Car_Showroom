function AdminDetailHero({
  name,
  price,
  onChange,
  namePlaceholder = "Car Name",
  pricePlaceholder = "Price",
}) {
  return (
    <div className="admin-detail-hero">
      <input
        className="admin-detail-input title"
        value={name}
        placeholder={namePlaceholder}
        onChange={(e) => onChange("name", e.target.value)}
      />

      <input
        className="admin-detail-input price"
        value={price}
        placeholder={pricePlaceholder}
        onChange={(e) => onChange("price", e.target.value)}
      />
    </div>
  );
}

export default AdminDetailHero;