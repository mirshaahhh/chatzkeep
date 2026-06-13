const express = require("express");
const router = express.Router();
const User = require("../models/User");

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadResume,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get("/profile", protect, getProfile);

router.get("/users", protect, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
    }).select("-password");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

router.put("/profile", protect, updateProfile);

module.exports = router;