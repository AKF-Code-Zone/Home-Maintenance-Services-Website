import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Appcontext";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, setUser, logout } = useAppContext();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:5000/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Session expired or failed to fetch user data");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    if (!user) fetchUser();
    else setLoading(false);
  }, [user, setUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-emerald-700">Loading your dashboard...</div>
      </div>
    );
  if (!user) return null;

  return (
    <div className="dashboard-page min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Header & Profile Greeting */}
        <div className="flex justify-between items-center mb-10 p-8 bg-white rounded-xl shadow-lg border-b-4 border-emerald-500">
          <div>
            <h1 className="text-4xl font-extrabold text-emerald-800">
              Hello, {user.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome to your Home Services Command Center.
            </p>
          </div>
          {/* Mock Profile Icon/Image for visual impact */}
          <Link to="/profile" className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-full hover:bg-emerald-100 transition duration-300">
            <span className="text-2xl">👤</span>
            <span className="hidden sm:inline text-emerald-700 font-semibold">View Profile</span>
          </Link>
        </div>

        {/* 2. Key Stat Cards (Mini-Summary) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stat Card 1: Upcoming Bookings */}
          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-amber-500 hover:shadow-lg transition">
            <p className="text-sm font-medium text-gray-500">Upcoming Services</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">2</p>
            <Link to="/bookings" className="text-sm text-amber-500 hover:text-amber-600 transition">View Schedule →</Link>
          </div>
          
          {/* Stat Card 2: Active Chats (Instant Chat Service) */}
          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition">
            <p className="text-sm font-medium text-gray-500">Active Support Chats</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">1</p>
            <Link to="/chat" className="text-sm text-blue-500 hover:text-blue-600 transition">Go to Chat →</Link>
          </div>
          
          {/* Stat Card 3: Pending Ratings (Rating Service) */}
          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition">
            <p className="text-sm font-medium text-gray-500">Pending Ratings</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">1</p>
            <Link to="/services/reviews-ratings" className="text-sm text-green-500 hover:text-green-600 transition">Rate Now →</Link>
          </div>
        </div>

        {/* 3. Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* 3A. Quick Actions (1/3 Width) - Enhanced Sidebar Styling */}
          <div className="lg:col-span-1 space-y-6 p-6 bg-white rounded-xl shadow-xl border border-emerald-100 h-fit sticky top-8">
            <h2 className="text-2xl font-bold text-emerald-800 border-b pb-3">Quick Service Access</h2>
            
            {/* Card: New Booking (Original /services link) */}
            <Link to="/services/booking-service" className="block p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400 hover:bg-emerald-100 transition duration-300">
              <h3 className="text-lg font-bold text-emerald-800">🛠️ Book A New Service</h3>
              <p className="text-gray-600 text-sm mt-1">Explore all categories and schedule a technician.</p>
            </Link>

            {/* Card: Service Area / Availability Finder */}
            <Link to="/services/technician-availability" className="block p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400 hover:bg-amber-100 transition duration-300">
              <h3 className="text-lg font-bold text-emerald-800">📍 Check Technician Availability</h3>
              <p className="text-gray-600 text-sm mt-1">See services and professionals available in your area.</p>
            </Link>
            
            {/* Card: Instant Chat */}
            <Link to="/services/instant-chat" className="block p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 hover:bg-blue-100 transition duration-300">
              <h3 className="text-lg font-bold text-emerald-800">💬 Instant Chat & Support</h3>
              <p className="text-gray-600 text-sm mt-1">Talk directly with a technician or customer support.</p>
            </Link>
          </div>

          {/* 3B. Recent Activity (2/3 Width) - Focused on Managing Existing Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-emerald-800 border-b pb-2">Your Activity & Bookings</h2>
            
            {/* Pending Rating Alert (Uses Rating Service) */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md" role="alert">
              <p className="font-bold">Action Required: Rating! ⭐</p>
              <p className="text-sm">Your recent **Plumbing Repair** on **Nov 28** is complete. Please <Link to="/ratings/last-order" className="font-semibold underline hover:text-yellow-900">submit your rating</Link> now.</p>
            </div>
            
            {/* Recent Bookings Table */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-emerald-800">Last 3 Bookings (Customer Booking)</h3>
                <Link to="/bookings" className="text-sm font-medium text-emerald-600 hover:text-emerald-900">View All Bookings →</Link>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* UPDATED: Increased padding from px-6 to px-8 for better spacing */}
                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    {/* UPDATED: Increased padding from px-6 to px-8 for better spacing */}
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AC Installation</td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">29 Nov, 10:00 AM</td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Upcoming</span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to="/bookings/id1" className="text-emerald-600 hover:text-emerald-900">View</Link>
                    </td>
                  </tr>
                  <tr>
                    {/* UPDATED: Increased padding from px-6 to px-8 for better spacing */}
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Deep Cleaning</td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">25 Nov, 2:00 PM</td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to="/ratings/id2" className="text-green-600 hover:text-green-900">Rate</Link>
                    </td>
                  </tr>
                  <tr>
                    {/* UPDATED: Increased padding from px-6 to px-8 for better spacing */}
                    <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Plumbing Repair</td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">18 Nov, 9:00 AM</td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to="/bookings/id3" className="text-gray-600 hover:text-gray-900">Details</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Footer & Logout Section */}
        <div className="flex justify-end mt-12 pt-6 border-t border-gray-200">
          <Link
              to="/profile"
              className="text-gray-600 font-medium hover:text-emerald-700 transition duration-300 mr-4 self-center"
            >
              👤 Profile Settings
          </Link>
          <button
            onClick={handleLogout}
            className="bg-amber-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-amber-600 transition"
          >
            Logout
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;