// civictrack-backend/routes/admin.js
import express from "express";
import Flag from "../models/Flag.js";
import Issue from "../models/Issue.js";
import isAdmin from "../middleware/isAdmin.js";


const router = express.Router();
router.use(isAdmin);


// GET /api/admin/flags — List flagged issues
router.get("/flags", async (req, res) => {
  try {
    const flags = await Flag.find().populate("issueId userId");
    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: "Error fetching flags", error: err });
  }
});

// DELETE /api/admin/flags/:flagId — Remove flag entry
router.delete("/flags/:flagId", async (req, res) => {
  try {
    await Flag.findByIdAndDelete(req.params.flagId);
    res.json({ message: "Flag removed" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting flag", error: err });
  }
});

// DELETE /api/admin/issues/:id — Remove spam issue
router.delete("/issues/:id", async (req, res) => {
  try {
    await Issue.findByIdAndDelete(req.params.id);
    await Flag.deleteMany({ issueId: req.params.id });
    res.json({ message: "Issue and associated flags deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting issue", error: err });
  }
});

export default router;
