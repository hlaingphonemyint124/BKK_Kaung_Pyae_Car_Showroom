function PanelHead({
  icon: Icon,
  iconColor,
  title,
  action,
}) {
  return (
    <div className="dash-panel__head">
      <div className="dash-panel__head-left">
        {Icon && (
          <div
            className="dash-panel__head-icon"
            style={{ color: iconColor }}
          >
            <Icon size={16} strokeWidth={2.2} />
          </div>
        )}

        <span className="dash-panel__head-label">
          {title}
        </span>
      </div>

      {action && (
        <div className="dash-panel__head-action">
          {action}
        </div>
      )}
    </div>
  );
}

export default PanelHead;