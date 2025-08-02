// civictrack-backend/routes/issues.js
import express from "express";
import multer from "multer";
import Issue from "../models/Issue.js";
import cloudinary from "../utils/cloudinary.js";
import Flag from "../models/Flag.js";


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/issues — Report new issue
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { title, description, category, lat, lng, anonymous, userId } =
      req.body;

    // Upload images to Cloudinary
    const imageUploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (err, result) => {
          if (err) throw err;
          return result.secure_url;
        }
      )
    );

    const uploadedImages = await Promise.all(imageUploadPromises);

    const newIssue = new Issue({
      title,
      description,
      category,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      images: uploadedImages,
      anonymous: anonymous === "true",
      reporter: anonymous === "true" ? null : userId,
      statusLogs: [{ status: "Reported", timestamp: new Date() }],
    });

    await newIssue.save();
    res.status(201).json({ message: "Issue reported successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error reporting issue", error });
  }
});

// GET /api/issues — Fetch nearby issues
router.get("/", async (req, res) => {
  const { lat, lng, radius = 5000, category, status } = req.query;

  const query = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseInt(radius),
      },
    },
  };

  if (category) query.category = category;
  if (status) query.status = status;

  const issues = await Issue.find(query);
  res.json(issues);
});

// PUT /api/issues/:id/status — Update status (Admin only)
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ message: "Issue not found" });

  issue.status = status;
  issue.statusLogs.push({ status, timestamp: new Date() });
  await issue.save();

  res.json({ message: "Status updated" });
});
// POST /api/issues/:id/flag
router.post("/:id/flag", async (req, res) => {
  const { userId, reason } = req.body;
  const issueId = req.params.id;

  try {
    const existingFlag = await Flag.findOne({ issueId, userId });
    if (existingFlag) {
      return res.status(400).json({ message: "You have already flagged this issue." });
    }

    const newFlag = new Flag({ issueId, userId, reason });
    await newFlag.save();

    res.status(201).json({ message: "Issue flagged for review." });
  } catch (err) {
    res.status(500).json({ message: "Could not flag issue", error: err });
  }
});
export default router;
