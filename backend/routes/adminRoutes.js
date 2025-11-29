const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

const {
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getOrganisers,
  approveOrganiser,
  rejectOrganiser,
} = require("../controllers/adminController");

// Events
router.get("/events/pending", protect, requireAdmin, getPendingEvents);
router.patch("/events/:id/approve", protect, requireAdmin, approveEvent);
router.patch("/events/:id/reject", protect, requireAdmin, rejectEvent);

// Organisers
router.get("/organisers", protect, requireAdmin, getOrganisers);
router.patch("/organisers/:id/approve", protect, requireAdmin, approveOrganiser);
router.patch("/organisers/:id/reject", protect, requireAdmin, rejectOrganiser);

module.exports = router;
