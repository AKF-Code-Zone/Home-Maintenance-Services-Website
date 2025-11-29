import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Send token in HTTP-only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return token;
};

export default generateToken;
