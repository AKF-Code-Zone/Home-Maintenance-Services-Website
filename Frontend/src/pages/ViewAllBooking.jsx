import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    contact: "",
    service: "",
    date: "",
    time: "",
    details: ""
  });

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setBookings(data.bookings);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
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

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Cancelled":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Pending":
        return "bg-white text-gray-800 border border-gray-300";
      default:
        return "bg-white text-gray-800 border border-gray-300";
    }
  };

  // Calculate booking statistics
  const bookingStats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="viewbookings-page min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="viewbookings-page min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-emerald-100 rounded-full mr-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Service Bookings</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Efficiently manage and track all your service appointments in one centralized dashboard
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-emerald-600">{bookingStats.total}</div>
            <div className="text-sm text-gray-500 mt-1">Total Bookings</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-emerald-600">{bookingStats.pending}</div>
            <div className="text-sm text-gray-500 mt-1">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-emerald-600">{bookingStats.completed}</div>
            <div className="text-sm text-gray-500 mt-1">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-2xl font-bold text-amber-600">{bookingStats.cancelled}</div>
            <div className="text-sm text-gray-500 mt-1">Cancelled</div>
          </div>
        </div>

        {/* Main Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-linear-to-r from-emerald-600 to-emerald-700 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">All Bookings</h2>
                <p className="text-emerald-100 mt-1">
                  Manage customer appointments and service requests
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {bookings.length} entries
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Service Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Current Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Manage Booking
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="text-gray-500">
                        <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        <h3 className="text-2xl font-medium text-gray-900 mb-2">No Bookings Yet</h3>
                        <p className="text-gray-500 mb-4">Start by creating your first service booking</p>
                        <button 
                          onClick={() => window.location.href = '/book-service'}
                          className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Create New Booking
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors duration-150 group">
                      {/* Customer Details */}
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4">
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

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-3">
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
                                className="flex-1 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors shadow-sm"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                          
                          {/* Status Dropdown */}
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {bookings.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Displaying <span className="font-semibold text-emerald-600">{bookings.length}</span> service bookings
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

export default ViewBookings;