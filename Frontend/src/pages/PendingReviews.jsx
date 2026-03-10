import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const RatingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('pending-reviews'); // 'pending-reviews', 'rated-services'
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editingRating, setEditingRating] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    contact: "",
    service: "",
    date: "",
    time: "",
    details: ""
  });
  const [editRatingForm, setEditRatingForm] = useState({
    stars: 0,
    title: "",
    review: ""
  });

  useEffect(() => {
    console.log("🔄 RatingManagement component loaded");
    console.log("📊 Number of bookings:", bookings.length);
    
    // Check for rated bookings
    const ratedBookings = bookings.filter(b => b.rated && b.rating);
    console.log("⭐ Number of rated bookings:", ratedBookings.length);
    
    if (ratedBookings.length > 0) {
      console.log("🔍 First rated booking details:", {
        id: ratedBookings[0]._id,
        rated: ratedBookings[0].rated,
        rating: ratedBookings[0].rating
      });
    }
  }, [bookings]);

  // Apply filter whenever activeFilter or bookings change
  useEffect(() => {
    console.log("🔄 Applying filter:", activeFilter);
    console.log("📋 Total bookings:", bookings.length);
    applyFilter(activeFilter);
  }, [bookings, activeFilter]);

  const applyFilter = (filterType) => {
    console.log("🎯 Filtering for:", filterType);
    
    let filtered = [];
    switch (filterType) {
      case 'pending-reviews':
        filtered = bookings.filter(b => {
          const isCompleted = b.status === 'Completed';
          const isNotRated = !b.rated;
          console.log(`📝 Booking ${b._id}: status=${b.status}, rated=${b.rated}, completed=${isCompleted}, notRated=${isNotRated}`);
          return isCompleted && isNotRated;
        });
        break;
      case 'rated-services':
        filtered = bookings.filter(b => {
          const hasRating = b.rated && b.rating;
          console.log(`⭐ Booking ${b._id}: rated=${b.rated}, rating=`, b.rating, 'hasRating=', hasRating);
          return hasRating;
        });
        break;
      default:
        filtered = bookings.filter(b => b.status === 'Completed' && !b.rated);
        break;
    }
    
    console.log(`✅ Filtered ${filtered.length} bookings for ${filterType}`);
    setFilteredBookings(filtered);
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        console.log("📥 Fetched bookings:", data.bookings.length);
        setBookings(data.bookings);
        // Initialize with pending reviews
        const pending = data.bookings.filter(b => b.status === 'Completed' && !b.rated);
        console.log("⏳ Initial pending reviews:", pending.length);
        setFilteredBookings(pending);
      }
    } catch (err) {
      console.error("❌ Failed to fetch bookings:", err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = (filterType) => {
    console.log("🖱️ Filter clicked:", filterType);
    setActiveFilter(filterType);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(bookings.filter(b => b._id !== id));
      toast.success("Booking deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDeleteRating = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/bookings/${id}/rating`,
        { rated: false, rating: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookings.map(b => (b._id === id ? data.booking : b)));
      toast.success("Rating deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/bookings/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(bookings.map(b => (b._id === id ? data.booking : b)));
      toast.success("Status updated successfully");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking._id);
    setEditFormData({
      name: booking.name,
      email: booking.email,
      contact: booking.contact,
      service: booking.service,
      date: booking.date.split('T')[0],
      time: booking.time,
      details: booking.details || ""
    });
  };

  const handleEditRating = (booking) => {
    // Add safety check for rating
    if (!booking.rating) {
      console.error("❌ Cannot edit rating: booking has no rating data", booking);
      toast.error("Cannot edit rating: No rating data found");
      return;
    }
    
    setEditingRating(booking._id);
    setEditRatingForm({
      stars: booking.rating.stars || 0,
      title: booking.rating.title || "",
      review: booking.rating.review || ""
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingEditChange = (e) => {
    setEditRatingForm({
      ...editRatingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleStarClick = (stars) => {
    setEditRatingForm({
      ...editRatingForm,
      stars: stars
    });
  };

  const handleUpdateBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/bookings/${id}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBookings(bookings.map(b => (b._id === id ? data.booking : b)));
      setEditingBooking(null);
      toast.success("Booking updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleUpdateRating = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:5000/api/bookings/${id}/rating`,
        {
          rating: {
            stars: editRatingForm.stars,
            title: editRatingForm.title,
            review: editRatingForm.review
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setBookings(bookings.map(b => (b._id === id ? data.booking : b)));
      setEditingRating(null);
      toast.success("Rating updated successfully");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const cancelEdit = () => {
    setEditingBooking(null);
    setEditFormData({
      name: "",
      email: "",
      contact: "",
      service: "",
      date: "",
      time: "",
      details: ""
    });
  };

  const cancelRatingEdit = () => {
    setEditingRating(null);
    setEditRatingForm({
      stars: 0,
      title: "",
      review: ""
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Cancelled":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case "Pending":
        return "bg-white text-gray-800 border border-gray-300";
      default:
        return "bg-white text-gray-800 border border-gray-300";
    }
  };

  // Calculate rating statistics with safety checks
  const ratingStats = {
    pendingReviews: bookings.filter(b => b.status === 'Completed' && !b.rated).length,
    rated: bookings.filter(b => b.rated && b.rating).length,
    averageRating: bookings.filter(b => b.rated && b.rating).length > 0 
      ? (bookings.filter(b => b.rated && b.rating).reduce((sum, b) => sum + (b.rating?.stars || 0), 0) / bookings.filter(b => b.rated && b.rating).length).toFixed(1)
      : 0
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="rating-management-page min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="rating-management-page min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section with more space above */}
        <div className="mb-8 text-center pt-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-full mr-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Rating Management</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and track all your service ratings and reviews in one centralized dashboard
          </p>
        </div>

        {/* Statistics Cards with Filter Functionality */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Pending Reviews Card */}
          <div 
            onClick={() => handleFilterClick('pending-reviews')}
            className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 p-6 text-center ${
              activeFilter === 'pending-reviews' 
                ? 'border-yellow-500 bg-yellow-50 transform scale-105' 
                : 'border-gray-200 hover:border-yellow-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl font-bold text-yellow-600">{ratingStats.pendingReviews}</div>
            <div className="text-sm text-gray-500 mt-1">Pending Reviews</div>
            {activeFilter === 'pending-reviews' && (
              <div className="text-xs text-yellow-600 font-medium mt-2">✓ Currently viewing</div>
            )}
          </div>

          {/* Rated Services Card */}
          <div 
            onClick={() => handleFilterClick('rated-services')}
            className={`bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 p-6 text-center ${
              activeFilter === 'rated-services' 
                ? 'border-emerald-500 bg-emerald-50 transform scale-105' 
                : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-2xl font-bold text-emerald-600">{ratingStats.rated}</div>
            <div className="text-sm text-gray-500 mt-1">Rated Services</div>
            {activeFilter === 'rated-services' && (
              <div className="text-xs text-emerald-600 font-medium mt-2">✓ Currently viewing</div>
            )}
          </div>

          {/* Average Rating Card */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-emerald-600">{ratingStats.averageRating}</div>
            <div className="flex justify-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-sm ${
                    star <= ratingStats.averageRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">Average Rating</div>
          </div>
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header with more padding and larger font */}
          <div className="bg-linear-to-r from-emerald-800 to-emerald-900 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {activeFilter === 'pending-reviews' && 'Pending Reviews'}
                  {activeFilter === 'rated-services' && 'Rated Services'}
                </h2>
                <p className="text-emerald-100 mt-2 text-lg">
                  {activeFilter === 'pending-reviews' && 'Complete your reviews for completed services'}
                  {activeFilter === 'rated-services' && 'View and manage your service ratings'}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Customer Information
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Service Details
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    {activeFilter === 'rated-services' ? 'Rating Details' : 'Current Status'}
                  </th>
                  <th className="px-8 py-6 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Manage {activeFilter === 'rated-services' ? 'Rating' : 'Booking'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="text-gray-500">
                        <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <h3 className="text-2xl font-medium text-gray-900 mb-2">
                          {activeFilter === 'pending-reviews' && 'No Pending Reviews'}
                          {activeFilter === 'rated-services' && 'No Rated Services'}
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {activeFilter === 'pending-reviews' && 'All your completed services have been rated. Great job!'}
                          {activeFilter === 'rated-services' && 'No rated services found. Rate your completed services to see them here.'}
                        </p>
                        {activeFilter === 'rated-services' && (
                          <button 
                            onClick={() => handleFilterClick('pending-reviews')}
                            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                          >
                            View Pending Reviews
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                      {/* Customer Details */}
                      <td className="px-8 py-6">
                        {editingBooking === booking._id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              name="name"
                              value={editFormData.name}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="Full Name"
                            />
                            <input
                              type="email"
                              name="email"
                              value={editFormData.email}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="Email Address"
                            />
                            <input
                              type="text"
                              name="contact"
                              value={editFormData.contact}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="Contact Number"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="shrink-0 h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                              <span className="text-sm font-semibold text-white">
                                {booking.name?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {booking.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                Phone: {booking.contact}
                              </div>
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Service & Date */}
                      <td className="px-8 py-6">
                        {editingBooking === booking._id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              name="service"
                              value={editFormData.service}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="Service Type"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="date"
                                name="date"
                                value={editFormData.date}
                                onChange={handleEditChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              />
                              <input
                                type="time"
                                name="time"
                                value={editFormData.time}
                                onChange={handleEditChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              />
                            </div>
                            <textarea
                              name="details"
                              value={editFormData.details}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                              placeholder="Additional service details..."
                              rows="2"
                            />
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm font-semibold text-gray-900 mb-2">
                              {booking.service}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              {new Date(booking.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              Time: {booking.time}
                            </div>
                            {booking.details && (
                              <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <span className="font-medium">Notes:</span> {booking.details}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Status or Rating Details */}
                      <td className="px-8 py-6">
                        {activeFilter === 'pending-reviews' ? (
                          <>
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            
                            {/* Status Dropdown */}
                            <div className="mt-3">
                              <select
                                onChange={(e) => handleUpdateStatus(booking._id, e.target.value)}
                                value={booking.status}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white shadow-sm"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </>
                        ) : (
                          /* Rating Display and Edit Form for Rated Services */
                          <div className="space-y-4">
                            {editingRating === booking._id ? (
                              <div className="space-y-3">
                                {/* Star Rating Editor */}
                                <div className="flex justify-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => handleStarClick(star)}
                                      className={`text-2xl ${
                                        star <= editRatingForm.stars 
                                          ? "text-yellow-400" 
                                          : "text-gray-300"
                                      } hover:text-yellow-300 transition-colors`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                                
                                {/* Rating Title */}
                                <input
                                  type="text"
                                  name="title"
                                  value={editRatingForm.title}
                                  onChange={handleRatingEditChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                  placeholder="Rating Title"
                                  maxLength="50"
                                />
                                
                                {/* Rating Review */}
                                <textarea
                                  name="review"
                                  value={editRatingForm.review}
                                  onChange={handleRatingEditChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                                  placeholder="Write your review..."
                                  rows="3"
                                  maxLength="500"
                                />
                                
                                <div className="text-xs text-gray-500 text-right">
                                  {editRatingForm.review.length}/500 characters
                                </div>
                              </div>
                            ) : (
                              /* Display Rating - WITH SAFETY CHECKS */
                              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="text-xs text-gray-500 mb-2">Your Rating</div>
                                <div className="flex justify-center mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => {
                                    // Add safety check for booking.rating and booking.rating.stars
                                    const shouldBeYellow = booking.rating && booking.rating.stars ? star <= booking.rating.stars : false;
                                    
                                    return (
                                      <span
                                        key={star}
                                        style={{
                                          color: shouldBeYellow ? '#fbbf24' : '#9ca3af',
                                          fontSize: '1.5rem',
                                          margin: '0 2px'
                                        }}
                                      >
                                        ★
                                      </span>
                                    );
                                  })}
                                </div>

                                {booking.rating?.title && (
                                  <div className="text-sm font-semibold text-gray-800 mb-2">
                                    "{booking.rating.title}"
                                  </div>
                                )}
                                
                                {booking.rating?.review && (
                                  <div className="text-sm text-gray-600 bg-white rounded p-3 border border-gray-100">
                                    {booking.rating.review}
                                  </div>
                                )}
                                
                                <div className="text-xs text-gray-500 mt-2">
                                  Rated on {booking.rating?.ratedAt ? new Date(booking.rating.ratedAt).toLocaleDateString() : new Date(booking.updatedAt).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-8 py-6">
                        <div className="flex flex-col space-y-3">
                          {activeFilter === 'pending-reviews' ? (
                            /* Pending Reviews Actions */
                            <>
                              {editingBooking === booking._id ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUpdateBooking(booking._id)}
                                    className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm"
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(booking)}
                                    className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(booking._id)}
                                    className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors shadow-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                              
                              {/* Rate Service Button - Only show for completed, unrated bookings */}
                              {booking.status === 'Completed' && !booking.rated && (
                                <Link
                                  to={`/rate-service/${booking._id}`}
                                  className="w-full bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors shadow-sm text-center block"
                                >
                                  Rate Service
                                </Link>
                              )}
                            </>
                          ) : (
                            /* Rated Services Actions */
                            <>
                              {editingRating === booking._id ? (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleUpdateRating(booking._id)}
                                    className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm"
                                  >
                                    Update Rating
                                  </button>
                                  <button
                                    onClick={cancelRatingEdit}
                                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditRating(booking)}
                                    className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm"
                                  >
                                    Edit Rating
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRating(booking._id)}
                                    className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors shadow-sm"
                                  >
                                    Delete Rating
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredBookings.length > 0 && (
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Displaying <span className="font-semibold text-emerald-600">{filteredBookings.length}</span>{" "}
                  {activeFilter === 'pending-reviews' ? 'pending reviews' : 'rated services'}
                </p>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingManagement;