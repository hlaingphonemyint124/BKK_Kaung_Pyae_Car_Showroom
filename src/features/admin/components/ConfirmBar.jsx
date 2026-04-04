function ConfirmBar({
  onClick,
  label = "Save",
  note = "",
}) {
  return (
    <div className="admin-confirm-wrap">
      {note && <p className="admin-confirm-wrap__note">{note}</p>}

      <button
        type="button"
        className="admin-confirm"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
}

export default ConfirmBar;