function AdminFilterBar() {
  return (
    <div className="admin-filterbar">
      <div className="admin-filterbar__item">
        <span>Filter</span>
        <span>⌄</span>
      </div>

      <div className="admin-filterbar__divider" />

      <div className="admin-filterbar__item">
        <span>Buy</span>
        <span>⌄</span>
      </div>

      <div className="admin-filterbar__divider" />

      <div className="admin-filterbar__item">
        <span>Search</span>
        <span>⌕</span>
      </div>
    </div>
  );
}

export default AdminFilterBar;