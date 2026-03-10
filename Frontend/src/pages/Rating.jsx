import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ServiceRating = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState({
    stars: 0,
    review: "",
    title: ""
  });

  // Fetch booking details when component loads
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (data.success) {
          setBooking(data.booking);
        } else {
          toast.error("Booking not found");
          navigate("/bookings");
        }
      } catch (error) {
        toast.error("Failed to load booking details");
        navigate("/bookings");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId, navigate]);

  const handleStarClick = (starCount) => {
    setRating({ ...rating, stars: starCount });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating.stars === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/rate`,
        {
          rating: rating.stars,
          review: rating.review,
          title: rating.title
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        toast.success("Thank you for your rating!");
        
        // 🔥 IMPORTANT: Force page reload to get fresh data
        setTimeout(() => {
          window.location.href = "/bookings"; // This reloads the entire page
        }, 1000);
        
      }
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rating-page min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="rating-page min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Booking not found</div>
      </div>
    );
  }

  return (
    <div className="rating-page min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header with more space above and increased font size */}
        <div className="text-center mb-12 pt-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Rate Your Service
          </h1>
          <p className="text-gray-600 text-lg">
            Share your experience to help us improve our services
          </p>
        </div>

        {/* Service Details Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Service Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold text-gray-900">Service Type:</span>
              <p className="text-gray-900 mt-1">{booking.service}</p>
            </div>
            <div>
              <span className="font-bold text-gray-900">Service Date:</span>
              <p className="text-gray-900 mt-1">
                {new Date(booking.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="font-bold text-gray-900">Service Time:</span>
              <p className="text-gray-900 mt-1">{booking.time}</p>
            </div>
            <div>
              <span className="font-bold text-gray-900">Status:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium mt-1 inline-block">
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Rating Form */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="mb-8">
              <label className="block text-base font-bold text-gray-900 mb-4">
                How would you rate this service? *
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="text-4xl focus:outline-none transition-transform hover:scale-110"
                  >
                    {star <= rating.stars ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="text-center mt-3">
                <span className="text-sm font-semibold text-gray-700">
                  {rating.stars === 0 && "Select your rating"}
                  {rating.stars === 1 && "Poor"}
                  {rating.stars === 2 && "Fair"}
                  {rating.stars === 3 && "Good"}
                  {rating.stars === 4 && "Very Good"}
                  {rating.stars === 5 && "Excellent"}
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-base font-bold text-gray-900 mb-3">
                Review Title (Optional)
              </label>
              <input
                type="text"
                id="title"
                value={rating.title}
                onChange={(e) => setRating({ ...rating, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Summarize your experience"
                maxLength={100}
              />
            </div>

            {/* Review Description */}
            <div className="mb-6">
              <label htmlFor="review" className="block text-base font-bold text-gray-900 mb-3">
                Detailed Review (Optional)
              </label>
              <textarea
                id="review"
                value={rating.review}
                onChange={(e) => setRating({ ...rating, review: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Tell us more about your experience with the service..."
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {rating.review.length}/500 characters
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-semibold"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || rating.stars === 0}
                className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {submitting ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </form>
        </div>

        {/* Rating Guidelines */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Your feedback helps us improve our services and assist other customers in making informed decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceRating;