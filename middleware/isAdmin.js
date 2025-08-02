// civictrack-backend/middleware/isAdmin.js
import User from "../models/User.js";

const isAdmin = async (req, res, next) => {
  try {
    const userId = req.header("x-user-id");
    if (!userId)
      return res.status(401).json({ message: "User ID missing in headers" });

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    req.user = user; // Pass user to route
    next();
  } catch (err) {
    res.status(500).json({ message: "Admin check failed", error: err });
  }
};

export default isAdmin;
