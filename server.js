// civictrack-backend/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import issueRoutes from "./routes/issues.js";
import adminRoutes from "./routes/admin.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes); // Handles /request-otp and /verify-otp
app.use("/api/issues", issueRoutes); // handles reporting, viewing, updating issues
app.use("/api/admin", adminRoutes); // 🆕 Admin actions like reviewing flags


app.get("/", (req, res) => {
  res.send("CivicTrack Backend API is running.");
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
