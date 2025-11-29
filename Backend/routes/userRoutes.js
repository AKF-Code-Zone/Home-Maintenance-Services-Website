import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sanitizeInput from "../utils/sanitizeInput.js";
import regEmailTest from "../utils/regEmailTest.js";
import isAlphabetOnly from "../utils/AlphabetOnly.js";
import charLength from "../utils/charLength.js";

const router = express.Router();

// ✅ REGISTER 
router.post("/register", async (req, res) => {
  try {
    const name = sanitizeInput(req.body.name);
    const email = sanitizeInput(req.body.email);
    const password = sanitizeInput(req.body.password);

    if (!name || isAlphabetOnly(name) === 0) {
      return res.status(400).json({ success: false, message: "Invalid name. Only letters allowed." });
    }
    if (charLength(name, 3, 35) === 0) {
      return res.status(400).json({ success: false, message: "Name must be 3-35 characters long." });
    }
    if (!email || regEmailTest(email) === 0) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }
    if (!password || charLength(password, 6, 35) === 0) {
      return res.status(400).json({ success: false, message: "Password must be 6-35 characters long." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }


    const newUser = await User.create({
      name,
      email,
      password,
    });

    generateToken(res, newUser._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ LOGIN 
router.post("/login", async (req, res) => {
  try {
    const email = sanitizeInput(req.body.email);
    const password = sanitizeInput(req.body.password);

    // --- SERVER-SIDE VALIDATION ---
    if (!email || regEmailTest(email) === 0) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    if (!password || charLength(password, 6, 35) === 0) {
      return res.status(400).json({ success: false, message: "Password must be 6-35 characters long" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Incorrect email and password combination" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect email and password combination" });
    }

    // Generate token
    const token = generateToken(res, user._id);

    // Send user data + token in response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;