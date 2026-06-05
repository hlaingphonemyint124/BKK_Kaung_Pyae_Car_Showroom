import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";
import { getDealerContact } from "../features/user/service/contactService";

const FALLBACK_CONTACT = {
  phone_number: "+66 XX XXX XXXX",
  gmail: "support@bkkkaungpyae.com",
  address: "Bangkok, Thailand",
  open_day_from: "Monday",
  open_day_to: "Sunday",
  open_time_from: "8 AM",
  open_time_to: "6 PM",
};

const logSettingsDebug = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

export default function Footer() {
  const { t }    = useLanguage();
  const navigate = useNavigate();
  const [contact, setContact] = useState(FALLBACK_CONTACT);

  useEffect(() => {
    getDealerContact()
      .then((data) => {
        logSettingsDebug("PUBLIC_SETTINGS_RESPONSE", data);
        setContact({ ...FALLBACK_CONTACT, ...(data.contact || data) });
      })
      .catch(() => setContact(FALLBACK_CONTACT));
  }, []);

  const QUICK_LINKS = [
    { label: t("footer_home"),   path: "/"       },
    { label: t("footer_shop"),   path: "/shop"   },
    { label: t("footer_brands"), path: "/brands" },
    { label: t("footer_rental"), path: "/rental" },
    { label: t("footer_about"),  path: "/about"  },
  ];

  return (
    <footer className="footer">
      <div className="footer-glow-line" />

      <div className="footer-container">
        <div className="footer-grid">

          {/* ── Brand Column ── */}
          <div className="footer-col footer-col--brand">
            <h2 className="footer-logo">BKK Kaung Pyae</h2>
            <p className="footer-tagline">
              {t("footer_tagline")}
            </p>

            <div className="footer-hours">
              <span className="footer-hours-dot" />
              {contact.open_day_from} - {contact.open_day_to}, {contact.open_time_from} - {contact.open_time_to}
            </div>

            <div className="footer-social">
              <button className="footer-social-btn whatsapp" aria-label="WhatsApp"
                onClick={() => contact.whatsapp_contact && window.open(contact.whatsapp_contact, "_blank", "noopener,noreferrer")}>
                <FaWhatsapp />
              </button>
              <button className="footer-social-btn facebook" aria-label="Facebook"
                onClick={() => contact.facebook_url && window.open(contact.facebook_url, "_blank", "noopener,noreferrer")}>
                <FaFacebook />
              </button>
              <button className="footer-social-btn instagram" aria-label="Instagram"
                onClick={() => contact.instagram_url && window.open(contact.instagram_url, "_blank", "noopener,noreferrer")}>
                <FaInstagram />
              </button>
              <button className="footer-social-btn location" aria-label="Location"
                onClick={() => contact.map_url && window.open(contact.map_url, "_blank", "noopener,noreferrer")}>
                <FaMapMarkerAlt />
              </button>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t("footer_links")}</h4>
            <ul className="footer-links">
              {QUICK_LINKS.map(({ label, path }) => (
                <li key={path}>
                  <button type="button" onClick={() => navigate(path)}>{label}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="footer-col">
            <h4 className="footer-col-title">{t("footer_contact")}</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <span className="footer-contact-icon"><FaPhoneAlt /></span>
                <span>{contact.phone_number || FALLBACK_CONTACT.phone_number}</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon"><FaEnvelope /></span>
                <span>{contact.gmail || FALLBACK_CONTACT.gmail}</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon"><FaMapMarkerAlt /></span>
                <span>{contact.address || FALLBACK_CONTACT.address}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>{t("footer_rights")}</span>
          <span>{t("footer_made")}</span>
        </div>
      </div>
    </footer>
  );
}
