function ConfirmBar({ label = "Confirm", onClick }) {
  return (
    <div className="admin-confirm-bar">
      <button className="admin-confirm-btn" onClick={onClick}>
        {label} →
      </button>
    </div>
  );
}

export default ConfirmBar;