import React from "react";
import AuthHeader from "../../auth/components/AuthHeader";
import "../../auth/styles/AuthStyles.css";
import "../styles/UserStyles.css";
import ContactItem from "../components/ContactItem";
import { FaPhoneAlt, FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiLine, SiGmail } from "react-icons/si";

function ContactPage() {
  return (
    <AuthHeader>
      <div className="user-content-box">
        <h2 className="user-page-title">Contact Us</h2>

        <ContactItem
          label="Phone Number"
          icon={<FaPhoneAlt className="icon red-icon" />}
          value="+66 9xxxxxxx"
        />

        <ContactItem
          label="Line"
          icon={<SiLine className="icon line-icon" />}
          value="BKKkaungpyae"
        />

        <ContactItem
          label="Facebook"
          icon={<FaFacebookF className="icon facebook-icon" />}
          value="BKK Kaung Pyae Car Showroom"
        />

        <ContactItem
          label="Instagram"
          icon={<FaInstagram className="icon instagram-icon" />}
          value="BKK Kaung Pyae Car Showroom"
        />

        <ContactItem
          label="Gmail"
          icon={<SiGmail className="icon gmail-icon" />}
          value="support@bkkkaungpyae.com"
        />
      </div>
    </AuthHeader>
  );
}

export default ContactPage;