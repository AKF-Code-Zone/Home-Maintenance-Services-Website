import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/Appcontext";
import axios from "axios";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, setUser, logout } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingReviews: 0,
    upcomingBookings: 0,
    activeChats: 0,
    totalBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Fetch user data
      const userResponse = await axios.get("http://localhost:5000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.data.success) {
        setUser(userResponse.data.user);
      } else {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      // Fetch bookings for statistics
      const bookingsResponse = await axios.get("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (bookingsResponse.data.success) {
        const bookings = bookingsResponse.data.bookings;
        
        // Calculate real statistics
        const pendingReviews = bookings.filter(
          booking => booking.status === 'Completed' && !booking.rated
        ).length;

        const upcomingBookings = bookings.filter(
          booking => booking.status === 'Pending' || booking.status === 'Confirmed'
        ).length;

        const totalBookings = bookings.length;

        // For active chats, you'll need to implement this based on your chat system
        // This is a placeholder - implement based on your chat API
        const activeChatsResponse = await axios.get("http://localhost:5000/api/chats/active", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const activeChats = activeChatsResponse.data.success ? activeChatsResponse.data.activeChats : 0;

        setStats({
          pendingReviews,
          upcomingBookings,
          activeChats,
          totalBookings
        });

        // Get recent bookings (last 3)
        setRecentBookings(bookings.slice(0, 3));
      }

    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
      case 'Confirmed':
        return "bg-blue-100 text-blue-800";
      case 'Completed':
        return "bg-green-100 text-green-800";
      case 'Cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

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
          <Link to="/profile" className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-full hover:bg-emerald-100 transition duration-300">
            <span className="text-2xl">👤</span>
            <span className="hidden sm:inline text-emerald-700 font-semibold">View Profile</span>
          </Link>
        </div>

        {/* 2. Key Stat Cards (Real Data) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Stat Card 1: Total Bookings */}
          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-purple-500 hover:shadow-lg transition">
            <p className="text-sm font-medium text-gray-500">Total Bookings</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">{stats.totalBookings}</p>
            <Link to="/bookings" className="text-sm text-purple-500 hover:text-purple-600 transition">View All →</Link>
          </div>
          
          
          {/* Stat Card 3: Active Chats */}
          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition">
            <p className="text-sm font-medium text-gray-500">Active Support Chats</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">{stats.activeChats}</p>
            <Link to="/services/instant-chat" className="text-sm text-blue-500 hover:text-blue-600 transition">Go to Chat →</Link>
          </div>
          
          {/* Stat Card 4: Pending Ratings */}
          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition">
            <p className="text-sm font-medium text-gray-500">Service Ratings</p>
            <p className="text-3xl font-bold text-emerald-700 mt-1">{stats.pendingReviews}</p>
            <Link to="/pending-reviews" className="text-sm text-green-500 hover:text-green-600 transition">view ratings →</Link>
          </div>
        </div>

        {/* 3. Main Content: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* 3A. Quick Actions */}
          <div className="lg:col-span-1 space-y-6 p-6 bg-white rounded-xl shadow-xl border border-emerald-100 h-fit sticky top-8">
            <h2 className="text-2xl font-bold text-emerald-800 border-b pb-3">Quick Service Access</h2>
            
            <Link to="/services/booking-service" className="block p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400 hover:bg-emerald-100 transition duration-300">
              <h3 className="text-lg font-bold text-emerald-800">🛠️ Book A New Service</h3>
              <p className="text-gray-600 text-sm mt-1">Explore all categories and schedule a technician.</p>
            </Link>

            <Link to="/services/technician-availability" className="block p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400 hover:bg-amber-100 transition duration-300">
              <h3 className="text-lg font-bold text-emerald-800">📍 Check Technician Availability</h3>
              <p className="text-gray-600 text-sm mt-1">See services and professionals available in your area.</p>
            </Link>
            
            <Link to="/services/instant-chat" className="block p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 hover:bg-blue-100 transition duration-300">
              <h3 className="text-lg font-bold text-emerald-800">💬 Instant Chat & Support</h3>
              <p className="text-gray-600 text-sm mt-1">Talk directly with a technician or customer support.</p>
            </Link>

            {/* Pending Reviews Quick Access */}
            {stats.pendingReviews > 0 && (
              <Link to="/pending-reviews" className="block p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400 hover:bg-yellow-100 transition duration-300">
                <h3 className="text-lg font-bold text-emerald-800">⭐ Rate Completed Services</h3>
                <p className="text-gray-600 text-sm mt-1">
                  You have {stats.pendingReviews} service{stats.pendingReviews > 1 ? 's' : ''} waiting for your rating
                </p>
              </Link>
            )}
          </div>

          {/* 3B. Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-emerald-800 border-b pb-2">Your Recent Activity</h2>
            
            {/* Pending Rating Alert */}
            {stats.pendingReviews > 0 && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md" role="alert">
                <p className="font-bold">Action Required: Rating! ⭐</p>
                <p className="text-sm">
                  You have {stats.pendingReviews} completed service{stats.pendingReviews > 1 ? 's' : ''} waiting for your rating. 
                  Please <Link to="/pending-reviews" className="font-semibold underline hover:text-yellow-900">submit your ratings</Link> to help us improve.
                </p>
              </div>
            )}
            
            {/* Recent Bookings Table */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              
              
              {recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bookings found.</p>
                  <Link 
                    to="/services/booking-service" 
                    className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    Book Your First Service
                  </Link>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.service}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(booking.date)}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {booking.status === 'Completed' && !booking.rated ? (
                            <Link to={`/rate-service/${booking._id}`} className="text-green-600 hover:text-green-900">
                              Rate
                            </Link>
                          ) : (
                            <Link to={`/bookings/${booking._id}`} className="text-emerald-600 hover:text-emerald-900">
                              View
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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