import express from "express";
import Booking from "../models/Booking.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// KEEP ALL YOUR EXISTING ROUTES EXACTLY AS THEY ARE
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

// Add this route after the GET all bookings route
router.get("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the booking belongs to the authenticated user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this booking",
      });
    }

    res.json({
      success: true,
      booking,
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

router.post("/:id/rate", protect, async (req, res) => {
  try {
    console.log("🔍 === RATING SUBMISSION DEBUG START ===");
    console.log("📝 Request details:", {
      bookingId: req.params.id,
      user: req.user ? req.user._id : "No user",
      ratingData: req.body
    });

    const { rating, review, title } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      console.log("❌ Invalid rating provided:", rating);
      return res.status(400).json({
        success: false,
        message: "Please provide a valid rating between 1 and 5 stars"
      });
    }

    console.log("✅ Valid rating received:", rating);

    // Check if booking exists first
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) {
      console.log("❌ Booking not found with ID:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    console.log("📋 Found booking:", {
      id: existingBooking._id,
      service: existingBooking.service,
      currentStatus: existingBooking.status
    });

    // Prepare update data
    const updateData = {
      rated: true,
      rating: {
        stars: parseInt(rating),
        title: title || "",
        review: review || "", 
        ratedAt: new Date()
      }
    };

    console.log("💾 Update data to save:", JSON.stringify(updateData, null, 2));

    // Update the booking
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    console.log("✅ Booking updated successfully:", {
      id: booking._id,
      rated: booking.rated,
      rating: booking.rating
    });

    // Verify the update worked
    const verifiedBooking = await Booking.findById(req.params.id);
    console.log("🔍 Verified booking after update:", {
      rated: verifiedBooking.rated,
      rating: verifiedBooking.rating
    });

    console.log("🎉 === RATING SUBMISSION DEBUG END ===");

    res.json({
      success: true,
      message: "Rating submitted successfully",
      booking
    });
  } catch (err) {
    console.error("💥 RATING SUBMISSION ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// DELETE RATING ROUTE
router.put("/:id/rating", protect, async (req, res) => {
  try {
    console.log("🗑️ === DELETE/UPDATE RATING DEBUG START ===");
    console.log("📝 Request details:", {
      bookingId: req.params.id,
      user: req.user ? req.user._id : "No user",
      updateData: req.body
    });

    // Check if booking exists
    const existingBooking = await Booking.findById(req.params.id);
    if (!existingBooking) {
      console.log("❌ Booking not found with ID:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    console.log("📋 Found booking:", {
      id: existingBooking._id,
      service: existingBooking.service,
      rated: existingBooking.rated,
      rating: existingBooking.rating
    });

    // Handle different update scenarios
    let updateData = {};
    
    if (req.body.rated === false && req.body.rating === null) {
      // Delete rating scenario
      updateData = {
        rated: false,
        rating: null
      };
      console.log("🗑️ Deleting rating from booking");
    } else if (req.body.rating) {
      // Update rating scenario
      const { stars, title, review } = req.body.rating;
      
      // Validate rating
      if (stars && (stars < 1 || stars > 5)) {
        console.log("❌ Invalid rating stars:", stars);
        return res.status(400).json({
          success: false,
          message: "Please provide a valid rating between 1 and 5 stars"
        });
      }

      updateData = {
        rated: true,
        rating: {
          stars: stars || existingBooking.rating?.stars,
          title: title || existingBooking.rating?.title || "",
          review: review || existingBooking.rating?.review || "",
          ratedAt: existingBooking.rating?.ratedAt || new Date()
        }
      };
      console.log("✏️ Updating rating data");
    } else {
      console.log("❌ Invalid update data provided");
      return res.status(400).json({
        success: false,
        message: "Invalid update data provided"
      });
    }

    console.log("💾 Update data to save:", JSON.stringify(updateData, null, 2));

    // Update the booking
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    console.log("✅ Booking rating updated successfully:", {
      id: booking._id,
      rated: booking.rated,
      rating: booking.rating
    });

    console.log("🎉 === RATING UPDATE DEBUG END ===");

    res.json({
      success: true,
      message: req.body.rated === false ? "Rating deleted successfully" : "Rating updated successfully",
      booking
    });
  } catch (err) {
    console.error("💥 RATING UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// GET RATINGS SUMMARY ROUTE (Optional - for statistics)
router.get("/user/ratings/summary", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id });
    
    const ratedBookings = bookings.filter(b => b.rated && b.rating);
    const pendingReviews = bookings.filter(b => b.status === 'Completed' && !b.rated);
    
    const averageRating = ratedBookings.length > 0 
      ? (ratedBookings.reduce((sum, b) => sum + b.rating.stars, 0) / ratedBookings.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      summary: {
        totalBookings: bookings.length,
        ratedServices: ratedBookings.length,
        pendingReviews: pendingReviews.length,
        averageRating: parseFloat(averageRating)
      }
    });
  } catch (err) {
    console.error("💥 RATINGS SUMMARY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

export default router;