import React from "react";
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

export default function Footer() {
  const { t }    = useLanguage();
  const navigate = useNavigate();

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
              {t("footer_hours")}
            </div>

            <div className="footer-social">
              <button className="footer-social-btn whatsapp" aria-label="WhatsApp">
                <FaWhatsapp />
              </button>
              <button className="footer-social-btn facebook" aria-label="Facebook">
                <FaFacebook />
              </button>
              <button className="footer-social-btn instagram" aria-label="Instagram">
                <FaInstagram />
              </button>
              <button className="footer-social-btn location" aria-label="Location">
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
                  <span onClick={() => navigate(path)}>{label}</span>
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
                <span>+66 XX XXX XXXX</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon"><FaEnvelope /></span>
                <span>support@bkkkaungpyae.com</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon"><FaMapMarkerAlt /></span>
                <span>Bangkok, Thailand</span>
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
