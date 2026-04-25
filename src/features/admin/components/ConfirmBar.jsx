import { ArrowRight } from "lucide-react";

function ConfirmBar({ onClick, label = "Save", note = "" }) {
  return (
    <div className="admin-confirm-wrap">
      {note && <p className="admin-confirm-wrap__note">{note}</p>}
      <button type="button" className="admin-confirm" onClick={onClick}>
        <span>{label}</span>
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default ConfirmBar;
