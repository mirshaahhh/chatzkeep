const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadResume,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);
// Protected Routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

module.exports = router;