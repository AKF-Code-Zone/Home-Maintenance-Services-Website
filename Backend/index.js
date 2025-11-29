import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/booking.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
     origin: ["http://localhost:5173", "http://localhost:5174"], // React app
    credentials: true,
  })
);

// Routes
app.use("/user", userRoutes);
app.use("/api/bookings", bookingRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));