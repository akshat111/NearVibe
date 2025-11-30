const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  toggleInterest,
  checkInToEvent,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");
const { requireOrganiser } = require("../middleware/roleMiddleware");

// public
router.get("/", getEvents);
router.get("/:id", getEventById);

// organiser-only
router.post("/", protect, requireOrganiser, createEvent);
router.get("/me/my-events", protect, requireOrganiser, getMyEvents);
router.patch("/:id", protect, requireOrganiser, updateEvent);

// users (logged-in) interest toggle
router.post("/:id/interest", protect, toggleInterest);
router.post("/:id/check-in", protect, checkInToEvent);

module.exports = router;
