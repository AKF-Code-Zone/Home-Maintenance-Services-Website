import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../../App.css";

const BookingService = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    service: "",
    date: "",
    time: "",
    details: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Initialize navigate

  const toggleForm = () => setFormVisible(!formVisible);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Please login to book a service");
      return;
    }

    setSubmitting(true);
    
    try {
      console.log("Submitting booking data:", formData);
      
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );

      console.log("Booking response:", response.data);
      
      if (response.data.success) {
        toast.success("Booking created successfully!");
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          contact: "",
          service: "",
          date: "",
          time: "",
          details: ""
        });
        
        setFormVisible(false);
        
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err) {
      console.error("Booking error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      const errorMessage = err.response?.data?.message || "Failed to create booking";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="booking-container">
      {/* Hero Section */}
      <section className="booking-hero">
        <div className="hero-text">
          <h1>
            Book Your <span>HomeFix</span> Service Appointment
          </h1>
          <p>
            Schedule appointments with our trusted professionals in just a few clicks.
          </p>
          <button className="book-btn" onClick={toggleForm}>
            {formVisible ? "Close Form" : "Book Now"}
          </button>
        </div>
        <div className="hero-image">
          <img src="/images/booking.jpg" alt="Booking Service" />
        </div>
      </section>

      {/* Booking Form */}
      {formVisible && (
        <section className="booking-form">
          <h2>Quick & Easy Booking</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email Address"
                required
              />
            </div>
            
            <div className="form-row">
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                type="text"
                placeholder="Contact Number"
                required
              />
              <input
                name="service"
                value={formData.service}
                onChange={handleChange}
                type="text"
                placeholder="Service Type (e.g. Plumbing)"
                required
              />
            </div>

            <div className="form-row">
              <input
                name="date"
                value={formData.date}
                onChange={handleChange}
                type="date"
                required
              />
              <input
                name="time"
                value={formData.time}
                onChange={handleChange}
                type="time"
                required
              />
            </div>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Additional Details"
            ></textarea>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </section>
      )}

      {/* Footer */}
      <footer className="booking-footer">
        <p>
          © 2025 HomeFix — Connecting you with trusted professionals for all your home needs.
        </p>
      </footer>
    </div>
  );
};

export default BookingService;