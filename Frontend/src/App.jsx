import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Services from "./pages/services/Services";
import InstantChat from "./pages/services/InstantChat";
import BookingService from "./pages/services/BookingService";
import ServiceAreaFinder from "./pages/services/ServiceAreaFinder";
import ReviewsRatings from "./pages/services/ReviewsRatings";
import TechnicianAvailability from "./pages/services/TechnicianAvailability";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ViewBookings from "./pages/ViewAllBooking";
import ServiceRating from "./pages/Rating";
import RatingManagement from "./pages/PendingReviews"; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/instant-chat" element={<InstantChat />} />
        <Route path="/services/booking-service" element={<BookingService />} />
        <Route path="/services/service-area-finder" element={<ServiceAreaFinder />} />
        <Route path="/services/reviews-ratings" element={<ReviewsRatings />} />
        <Route path="/services/technician-availability" element={<TechnicianAvailability />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<ViewBookings />} />
        <Route path="/rate-service/:bookingId" element={<ServiceRating />} />
        <Route path="/pending-reviews" element={<RatingManagement />} />
      
      </Routes>
      <Footer />
    </>
  );
}

export default App;
