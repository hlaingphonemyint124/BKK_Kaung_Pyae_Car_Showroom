import { TrendingUp } from "lucide-react";

function StatCard({
  icon: Icon,
  iconBg,
  accent,
  label,
  value,
  sub1,
  sub2,
  valueIsText,
  progress,
}) {
  return (
    <div
      className="dash-stat-card"
      style={{ "--card-accent": accent || iconBg }}
    >
      <div className="dash-stat-card__top">
        <div
          className="dash-stat-card__icon"
          style={{ background: iconBg }}
        >
          <Icon size={16} strokeWidth={2.2} color="#fff" />
        </div>

        <TrendingUp
          size={14}
          className="dash-stat-card__trend"
        />
      </div>

      <p
        className={
          valueIsText
            ? "dash-stat-card__val dash-stat-card__val--text"
            : "dash-stat-card__val"
        }
      >
        {value}
      </p>

      <p className="dash-stat-card__label">
        {label}
      </p>

      {progress !== undefined && (
        <div className="dash-stat-card__progress">
          <div
            className="dash-stat-card__progress-fill"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: accent || iconBg,
            }}
          />
        </div>
      )}

      {(sub1 || sub2) && (
        <div className="dash-stat-card__subs">
          {sub1 && (
            <span className="dash-stat-card__sub">
              {sub1}
            </span>
          )}

          {sub2 && (
            <span className="dash-stat-card__sub">
              {sub2}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default StatCard;