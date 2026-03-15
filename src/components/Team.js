import React from "react";
import "./Team.css";

const ceo = {
  name: "Mr. Kaung Pyae",
  role: "CEO"
};

const members = [
  { name: "Ms. Hsu Phyo", role: "Customer Support" },
  { name: "Mr. Kyaw Kyaw", role: "Manager" },
  { name: "Mr. Myo Kyaw", role: "Customer Support" },
  { name: "Ms. Thae Thae", role: "Customer Support" }
];

export default function Team(){
  return (
    <section className="team">

      <h2 className="team-title">Meet Our Team</h2>

      {/* CEO */}
      <div className="ceo">
        <div className="ceo-avatar"></div>
        <h4 className="ceo-name">{ceo.name}</h4>
        <p className="ceo-role">{ceo.role}</p>
      </div>

      {/* Team Grid */}
      <div className="team-grid">
        {members.map((m,i)=>(
          <div className="member" key={i}>
            <div className="avatar"></div>
            <h5 className="member-name">{m.name}</h5>
            <p className="member-role">{m.role}</p>
          </div>
        ))}
      </div>

      {/* dots */}
      <div className="dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>

      <div className="contact-team">
        Contact our team →
      </div>

    </section>
  )
}