import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "../App.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/*Brand / About */}
        <div className="footer-section about">
          <h2>Home<span>Fix</span></h2>
          <p>
            Your one-stop directory for trusted home maintenance professionals.
            From plumbing to pest control, we connect you with verified experts
            for every household need.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>📞 +92 300 1234567</p>
          <p>📧 info@homefix.com</p>
          <p>📍 Karachi, Pakistan</p>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} HomeFix. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
