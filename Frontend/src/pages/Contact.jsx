import React from "react";
import "../App.css";

function Contact() {
  return (
    <div className="contact-container">
      {/* CONTACT HEADER */}
      <section className="contact-header">
        <h2>Get in Touch</h2>
        <p>
          We’re here to help! Whether you have a question, need assistance, or want to book a service — reach out to us anytime.
        </p>
      </section>

      {/* CONTACT CONTENT */}
      <section className="contact-content">
        {/* LEFT SIDE — CONTACT INFO */}
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p>
            <i className="fa-solid fa-location-dot"></i> 123 Service Street, Karachi, Pakistan
          </p>
          <p>
            <i className="fa-solid fa-phone"></i> +92 300 1234567
          </p>
          <p>
            <i className="fa-solid fa-envelope"></i> support@homefix.com
          </p>

          <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        {/* RIGHT SIDE — CONTACT FORM */}
        <form className="contact-form">
          <h3>Send Us a Message</h3>
          <div className="form-group">
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <textarea placeholder="Your Message" rows="5" required></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </section>
    </div>
  );
}

export default Contact;

