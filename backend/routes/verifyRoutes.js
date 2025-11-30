const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  verifyPhone,
  verifyInstagram,
  verifyDigiLocker,
} = require("../controllers/verifyController");

router.post("/phone", protect, verifyPhone);
router.post("/instagram", protect, verifyInstagram);
router.post("/digilocker", protect, verifyDigiLocker);

module.exports = router;
