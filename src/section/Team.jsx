import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Team.css";
import ParticleBackground from "../components/ParticleBackground";
import { getPublicTeam } from "../api/team.api";

const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
};

const FALLBACK_CEO = { name: "Mr. Kaung Pyae Lwin", initials: "KP" };
const logTeamDebug = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

export default function Team() {
  const navigate = useNavigate();
  const [ceo, setCeo]           = useState(null);
  const [members, setMembers]   = useState([]);

  useEffect(() => {
    logTeamDebug("TEAM_SECTION_MOUNTED");
    getPublicTeam()
      .then((response) => {
        logTeamDebug("HOME_EMPLOYEES_RESPONSE", response.data);
        const list = response.data?.users || response.data?.data?.users || response.data?.data || response.data || [];
        const adminUser = list.find((u) => u.role === "admin");
        const employees = list.filter((u) => u.role === "employee" && u.is_active !== false);
        logTeamDebug("HOME_EMPLOYEES_NORMALIZED", employees);

        setCeo(adminUser
          ? { name: adminUser.full_name || adminUser.email, initials: getInitials(adminUser.full_name || adminUser.email) }
          : FALLBACK_CEO
        );

        setMembers(employees.map((u) => ({
          id:       u.id,
          name:     u.full_name || u.email,
          role:     u.role === "admin" ? "Chief Executive Officer" : "Sales Consultant",
          initials: getInitials(u.full_name || u.email),
        })));
      })
      .catch(() => {
        setCeo(FALLBACK_CEO);
        setMembers([]);
      });
  }, []);

  useEffect(() => {
    logTeamDebug("HOME_EMPLOYEES_RENDERED", members.map((employee) => employee.name));
  }, [members]);

  const displayCeo = ceo || FALLBACK_CEO;

  return (
    <section className="team">
      <ParticleBackground />
      <div className="sec-blob sec-blob--lg sec-blob--tc sec-blob--warm" />
      <div className="sec-blob sec-blob--md sec-blob--bl" />
      <div className="sec-blob sec-blob--sm sec-blob--mr" />
      <div className="sec-noise" />
      <span className="team-label">Our People</span>
      <h2 className="team-title">Meet Our <span>Team</span></h2>
      <p className="team-sub">The people behind every great experience</p>

      <div className="ceo-section">
        <div className="ceo-card">
          <div className="ceo-avatar-wrap">
            <div className="ceo-ring" />
            <div className="ceo-avatar">{displayCeo.initials}</div>
            <span className="ceo-badge">CEO</span>
          </div>
          <h4 className="ceo-name">{displayCeo.name}</h4>
          <p className="ceo-role-tag"><span />Chief Executive Officer<span /></p>
        </div>
      </div>

      {members.length > 0 && (
        <>
          <div className="divider">
            <div className="divider-line" />
            <div className="divider-dot" />
            <div className="divider-line" />
          </div>

          <div className="members-row">
            {members.map((m) => (
              <div className="member-item" key={m.id}>
                <div className="member-avatar">{m.initials}</div>
                <h5 className="member-name">{m.name}</h5>
                <p className="member-role">{m.role}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <button className="btn-primary btn--lg" onClick={() => navigate("/contact")}>
        CONTACT OUR TEAM <span className="btn-arrow">→</span>
      </button>
    </section>
  );
}
