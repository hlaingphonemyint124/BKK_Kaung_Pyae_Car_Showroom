import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthHeader from "../../auth/components/AuthHeader";
import "../../auth/styles/AuthStyles.css";
import "../styles/UserStyles.css";
import Spinner from "../../../components/Spinner";

import {
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaClock,
  FaViber,
} from "react-icons/fa";
import { SiLine, SiGmail } from "react-icons/si";

import { getDealerContact } from "../service/contactService";

const logSettingsDebug = (...args) => {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
};

function ContactPage() {
  const [searchParams] = useSearchParams();
  const carName = searchParams.get("car");

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const data = await getDealerContact();
        logSettingsDebug("PUBLIC_SETTINGS_RESPONSE", data);
        setContact(data.contact || data);
      } catch (error) {
        console.error("Failed to load dealer contact:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  const openLink = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <AuthHeader>
        <div className="user-content-box contact-page-box">
          <Spinner size="lg" />
        </div>
      </AuthHeader>
    );
  }

  return (
    <div className="contact-page-wrapper">
      <div className="user-content-box contact-page-box">
        <h2 className="user-page-title">Contact Us</h2>
        <p className="contact-subtitle">
          Need help choosing a car? Contact our showroom team.
        </p>

        {carName && (
          <div className="contact-inquiry-banner">
            <span className="contact-inquiry-tag">Inquiring about</span>
            <span className="contact-inquiry-car">{carName}</span>
          </div>
        )}

        <div className="contact-card-grid">
          <div className="contact-info-card">
            <div className="contact-card-icon red-icon">
              <FaPhoneAlt />
            </div>
            <h3>Call Us</h3>
            <p>{contact?.phone_number || "Not available"}</p>
            <span>{contact?.gmail || "No email provided"}</span>
          </div>

          <div className="contact-info-card">
            <div className="contact-card-icon red-icon">
              <FaClock />
            </div>
            <h3>Open Hours</h3>
            <p>
              {contact?.open_day_from || "Monday"} -{" "}
              {contact?.open_day_to || "Saturday"}
            </p>
            <span>
              {contact?.open_time_from || "09:00"} -{" "}
              {contact?.open_time_to || "18:00"}
            </span>
          </div>

          <div className="contact-info-card">
            <div className="contact-card-icon red-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Search Store</h3>
            <p>{contact?.address || "Find our showroom location"}</p>
            <button
              type="button"
              className="contact-map-btn"
              onClick={() => openLink(contact?.map_url)}
              disabled={!contact?.map_url}
            >
              Open Google Maps
            </button>
          </div>
        </div>

        <div className="contact-social-section">
          <h3>Connect With Us</h3>

          <div className="contact-social-row">
            <button
              type="button"
              className="contact-social-btn line"
              onClick={() => openLink(contact?.line_contact)}
              disabled={!contact?.line_contact}
            >
              <SiLine />
            </button>

            <button
              type="button"
              className="contact-social-btn facebook"
              onClick={() => openLink(contact?.facebook_url)}
              disabled={!contact?.facebook_url}
            >
              <FaFacebookF />
            </button>

            <button
              type="button"
              className="contact-social-btn instagram"
              onClick={() => openLink(contact?.instagram_url)}
              disabled={!contact?.instagram_url}
            >
              <FaInstagram />
            </button>

            <button
              type="button"
              className="contact-social-btn viber"
              onClick={() => openLink(contact?.viber_contact)}
              disabled={!contact?.viber_contact}
            >
              <FaViber />
            </button>

            <button
              type="button"
              className="contact-social-btn gmail"
              onClick={() => openLink(`mailto:${contact?.gmail}`)}
              disabled={!contact?.gmail}
            >
              <SiGmail />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
