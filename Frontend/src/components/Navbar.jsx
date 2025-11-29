import React from "react";
import { Link } from "react-router-dom";
import { FaTools } from "react-icons/fa";
import "../App.css";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <FaTools className="logo-icon" />
        <h2>Home<span>Fix</span></h2>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/services" className="nav-item">Services</Link>
        <Link to="/about" className="nav-item">About</Link>
        <Link to="/contact" className="nav-item">Contact</Link>
      </div>

      {/* Right-side Buttons */}
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
