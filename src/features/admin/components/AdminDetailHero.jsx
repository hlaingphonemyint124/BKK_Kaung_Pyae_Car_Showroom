function AdminDetailHero({ name, price, onChange }) {
  return (
    <div className="admin-detail-hero">
      <input
        className="admin-detail-input title"
        value={name}
        placeholder="Car Name"
        onChange={(e) => onChange("name", e.target.value)}
      />

      <input
        className="admin-detail-input price"
        value={price}
        placeholder="Price"
        onChange={(e) => onChange("price", e.target.value)}
      />
    </div>
  );
}

export default AdminDetailHero;