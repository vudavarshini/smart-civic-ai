const express = require("express");
const {
  detectImage,
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require("../controllers/complaintController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Route for uploading and classifying an image
router.post("/detect", protect, upload.single("image"), detectImage);

// Routes for complaint CRUD operations
router.route("/")
  .post(protect, createComplaint)
  .get(protect, getComplaints);

router.route("/:id")
  .get(protect, getComplaintById)
  .put(protect, updateComplaint)
  .delete(protect, adminOnly, deleteComplaint);

module.exports = router;
