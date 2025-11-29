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
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;