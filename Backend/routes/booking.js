import express from "express";
import Booking from "../models/Booking.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    console.log("Booking creation request received:", {
      body: req.body,
      user: req.user ? req.user._id : "No user"
    });

    // Validate required fields
    const { name, email, contact, service, date, time } = req.body;
    
    if (!name || !email || !contact || !service || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const bookingData = {
      name,
      email,
      contact,
      service,
      date,
      time,
      details: req.body.details || "",
      user: req.user._id,
    };

    const booking = await Booking.create(bookingData);
    
    console.log("Booking created successfully:", booking._id);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


router.put("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


router.delete("/:id", protect, async (req, res) => {
  try {
    const result = await Booking.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
