import React, { useState } from "react";
import "../../App.css";

const ReviewsRatings = () => {
  const [showForm, setShowForm] = useState(false);
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

  const [newReview, setNewReview] = useState({ name: "", comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment) {
      setReviews([...reviews, { ...newReview, rating: 5 }]);
      setNewReview({ name: "", comment: "" });
      setShowForm(false);
    }
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
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Leave a Review"}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form className="review-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={newReview.name}
            onChange={(e) =>
              setNewReview({ ...newReview, name: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Write your review..."
            value={newReview.comment}
            onChange={(e) =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            required
          ></textarea>
          <button type="submit" className="submit-btn">
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewsRatings;