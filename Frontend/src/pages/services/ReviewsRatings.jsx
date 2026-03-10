import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const ReviewsRatings = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([
    {
      name: "Alice Johnson",
      rating: 5,
      comment:
        "Excellent service! The technician was professional and resolved my issue quickly."
    },
    {
      name: "Michael Smith",
      rating: 4,
      comment:
        "Smooth booking process with timely updates. Would definitely use again."
    },
    {
      name: "Sophia Lee",
      rating: 5,
      comment:
        "Reliable and easy to use platform. The expert fixed my issue efficiently."
    },
    {
      name: "Daniel Carter",
      rating: 4,
      comment:
        "Professional and trustworthy. Service was delivered on time."
    },
    {
      name: "Emily Davis",
      rating: 5,
      comment:
        "Fantastic! The team was friendly and solved my electrical problem quickly."
    },
    {
      name: "James Wilson",
      rating: 4,
      comment:
        "Reliable and efficient service. Highly satisfied with the technician’s work."
    }
  ]);

  const handleLeaveReview = () => {
    // Redirect to login page when user clicks "Leave a Review"
    navigate("/login", {
      state: {
        redirectMessage: "Please login to leave a review"
      }
    });
  };

  return (
    <div className="reviews-container">
      <h1 className="reviews-title">Reviews & Ratings</h1>
      <p className="reviews-subtitle">
        See what our users are saying and share your feedback!
      </p>

      {/* Reviews Grid */}
      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <div className="review-card" key={i}>
            <h3>{r.name}</h3>
            <p className="stars">{"⭐".repeat(r.rating)}</p>
            <p>{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Leave Review Button */}
      <div className="review-button-container">
        <button
          className="review-button"
          onClick={handleLeaveReview}
        >
          Leave a Review
        </button>
      </div>
    </div>
  );
};

export default ReviewsRatings;