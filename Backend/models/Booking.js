import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String, required: true },
    service: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    details: { type: String },
    status: { type: String, default: "Pending" },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
    // ADD THESE NEW FIELDS FOR RATING
    rated: { type: Boolean, default: false },
    rating: {
      stars: { 
        type: Number, 
        min: 1, 
        max: 5,
        validate: {
          validator: function(v) {
            // Only validate if rated is true
            return !this.rated || (v >= 1 && v <= 5);
          },
          message: 'Rating must be between 1 and 5 stars when rated is true'
        }
      },
      title: { 
        type: String, 
        maxlength: 100 
      },
      review: { 
        type: String, 
        maxlength: 500 
      },
      ratedAt: { type: Date }
    }
  },
  { timestamps: true }
);

// Add index for better performance on common queries
BookingSchema.index({ user: 1, createdAt: -1 });
BookingSchema.index({ rated: 1 });
BookingSchema.index({ status: 1 });

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;