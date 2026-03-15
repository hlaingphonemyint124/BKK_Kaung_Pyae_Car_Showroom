import React from "react";
import "./Footer.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function Footer(){
  return (

<footer className="footer">

  <div className="footer-container">

    {/* Company Title */}
    <div className="footer-brand">
      <h2>BKK Kaung Pyae</h2>
      <p>Monday - Sunday 9am - 9pm</p>
    </div>

    {/* Contact */}
    <div className="footer-contact">

      <h4>Contact Us</h4>

      <div className="contact-item">
        <FaPhoneAlt className="contact-icon"/>
        <span>+66 XX XXX XXXX</span>
      </div>

      <div className="contact-item">
        <FaEnvelope className="contact-icon"/>
        <span>support@bkkkaungpyae.com</span>
      </div>

    </div>

    {/* Social Icons */}
    <div className="footer-social">

      <div className="social-icon whatsapp">
        <FaWhatsapp/>
      </div>

      <div className="social-icon location">
        <FaMapMarkerAlt/>
      </div>

      <div className="social-icon facebook">
        <FaFacebook/>
      </div>

      <div className="social-icon instagram">
        <FaInstagram/>
      </div>

    </div>

  </div>

  {/* Bottom Bar */}
  <div className="footer-bottom">
    <span>BKK Kaung Pyae Co.,Ltd</span>
    <span>Support ©</span>
  </div>

</footer>

  );
}