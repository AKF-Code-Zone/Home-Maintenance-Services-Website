import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // Then check cookies
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, no token" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ 
      success: false,
      message: "Not authorized, invalid token" 
    });
  }
};

export default protect;