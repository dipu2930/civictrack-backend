// civictrack-backend/routes/auth.js
import express from "express";
import crypto from "crypto";
import User from "../models/User.js";
import { sendOtpEmail } from "../utils/emailService.js";

const router = express.Router();

// Request OTP
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

  const user = await User.findOneAndUpdate(
    { email },
    { otp, otpExpires },
    { upsert: true, new: true }
  );

  await sendOtpEmail(email, otp);
  res.json({ message: "OTP sent to email" });
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpires < new Date()) {
    return res.status(401).json({ message: "Invalid or expired OTP" });
  }

  // Clear OTP after success
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  // Respond with success (you can also generate a token/session here)
  res.json({ message: "OTP verified successfully", userId: user._id });
});

export default router;
