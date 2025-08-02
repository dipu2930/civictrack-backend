// civictrack-backend/models/Flag.js
import mongoose from "mongoose";

const flagSchema = new mongoose.Schema({
  issueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

flagSchema.index({ issueId: 1, userId: 1 }, { unique: true }); // Prevent multiple flags from the same user

export default mongoose.model("Flag", flagSchema);
