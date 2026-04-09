import React from "react";
import "./Team.css";

const ceo = { name: "Mr. Kaung Pyae Lwin", role: "CEO" };

const members = [
  { name: "Ms. Hsu Phyo",  role: "Customer Support", initials: "HP" },
  { name: "Mr. Kyaw Kyaw", role: "Manager",           initials: "KK" },
  { name: "Mr. Myo Kyaw",  role: "Customer Support",  initials: "MK" },
  { name: "Ms. Thae Thae", role: "Customer Support",  initials: "TT" },
];

export default function Team() {
  return (
    <section className="team">
      <span className="team-label">Our People</span>
      <h2 className="team-title">Meet Our <span>Team</span></h2>
      <p className="team-sub">The people behind every great experience</p>

      <div className="ceo-section">
        <div className="ceo-card">
          <div className="ceo-avatar-wrap">
            <div className="ceo-ring" />
            <div className="ceo-avatar">KP</div>
            <span className="ceo-badge">CEO</span>
          </div>
          <h4 className="ceo-name">{ceo.name}</h4>
          <p className="ceo-role-tag"><span />{`Chief Executive Officer`}<span /></p>
        </div>
      </div>

      <div className="divider">
        <div className="divider-line" />
        <div className="divider-dot" />
        <div className="divider-line" />
      </div>

      <div className="members-row">
        {members.map((m, i) => (
          <div className="member-item" key={i}>
            <div className="member-avatar">{m.initials}</div>
            <h5 className="member-name">{m.name}</h5>
            <p className="member-role">{m.role}</p>
          </div>
        ))}
      </div>

      <div className="dots">
        <span className="dot active" />
        <span className="dot" />
        <span className="dot" />
      </div>

      <button className="contact-btn">
        CONTACT OUR TEAM <span className="btn-arrow">→</span>
      </button>
    </section>
  );
}