const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getSuggestions,
  sendRequest,
  getRequests,
  acceptRequest,
  rejectRequest,
  getMyBuddies,
  blockUser,
} = require("../controllers/buddyController");

// suggestion list (same city, trust-based)
router.get("/suggestions", protect, getSuggestions);

// my accepted buddies
router.get("/", protect, getMyBuddies);

// pending buddy requests (incoming + outgoing)
router.get("/requests", protect, getRequests);

// send request
router.post("/request/:targetUserId", protect, sendRequest);

// accept / reject
router.post("/accept/:connectionId", protect, acceptRequest);
router.post("/reject/:connectionId", protect, rejectRequest);

// block user
router.post("/block/:targetUserId", protect, blockUser);

module.exports = router;
