import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTools, FaBars, FaTimes } from "react-icons/fa";
import "../App.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((s) => !s);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <FaTools className="logo-icon" />
        <h2>Home<span>Fix</span></h2>
      </div>

      {/* Hamburger (mobile) */}
      <button
        className="menu-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={toggleMenu}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation Links */}
      <div className={`nav-links ${open ? "active" : ""}`} onClick={closeMenu}>
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/services" className="nav-item">Services</Link>
        <Link to="/about" className="nav-item">About</Link>
        <Link to="/contact" className="nav-item">Contact</Link>
        {/* On small screens, expose auth links inside menu for accessibility */}
        <div className="mobile-auth">
          <Link to="/login" className="nav-item">Login</Link>
          <Link to="/registration" className="nav-item">Register</Link>
        </div>
      </div>

      {/* Right-side Buttons (desktop) */}
      <div className="nav-buttons">
         <Link to="/login">
          <button className="btn-outline">Login</button>
        </Link>
        <Link to="/registration">
          <button className="btn-filled">Register</button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
