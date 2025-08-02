// civictrack-backend/models/Issue.js
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: {
      type: String,
      enum: [
        "Roads",
        "Lighting",
        "Water Supply",
        "Cleanliness",
        "Public Safety",
        "Obstructions",
      ],
      required: true,
    },
    images: [String], // Cloudinary URLs
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    status: {
      type: String,
      enum: ["Reported", "In Progress", "Resolved"],
      default: "Reported",
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    anonymous: { type: Boolean, default: false },
    statusLogs: [
      {
        status: String,
        timestamp: Date,
      },
    ],
  },
  { timestamps: true }
);

issueSchema.index({ location: "2dsphere" });

export default mongoose.model("Issue", issueSchema);
