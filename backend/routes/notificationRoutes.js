const express = require("express");
const {
  getNotifications,
  markNotificationsAsRead,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getNotifications);
router.route("/read").put(protect, markNotificationsAsRead);

module.exports = router;
