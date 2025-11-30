const User = require("../models/User");
const { TRUST_POINTS, addTrustPoints } = require("../utils/trustScore");

// POST /api/verify/phone
exports.verifyPhone = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isPhoneVerified) {
      user.isPhoneVerified = true;
      addTrustPoints(user, TRUST_POINTS.phone);
      await user.save();
      return res.json({
        message: "Phone verified & trust score updated",
        trustScore: user.trustScore,
        badge: user.badge,
      });
    }

    res.json({
      message: "Phone already verified",
      trustScore: user.trustScore,
      badge: user.badge,
    });
  } catch (err) {
    console.error("verifyPhone error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/verify/instagram
exports.verifyInstagram = async (req, res) => {
  try {
    const { instagramHandle } = req.body;
    if (!instagramHandle) {
      return res.status(400).json({ message: "instagramHandle is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isInstagramVerified) {
      user.isInstagramVerified = true;
      user.instagramHandle = instagramHandle;
      addTrustPoints(user, TRUST_POINTS.instagram);
      await user.save();

      return res.json({
        message: "Instagram linked & trust score updated",
        trustScore: user.trustScore,
        badge: user.badge,
      });
    }

    // already verified → just update handle if user changed it
    user.instagramHandle = instagramHandle;
    await user.save();

    res.json({
      message: "Instagram already verified, handle updated",
      trustScore: user.trustScore,
      badge: user.badge,
    });
  } catch (err) {
    console.error("verifyInstagram error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/verify/digilocker
// NOTE: real DigiLocker integration baad me, abhi assume frontend valid karega
exports.verifyDigiLocker = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isDigiLockerVerified) {
      user.isDigiLockerVerified = true;
      addTrustPoints(user, TRUST_POINTS.digilocker);
      await user.save();

      return res.json({
        message: "DigiLocker verified & trust score updated",
        trustScore: user.trustScore,
        badge: user.badge,
      });
    }

    res.json({
      message: "DigiLocker already verified",
      trustScore: user.trustScore,
      badge: user.badge,
    });
  } catch (err) {
    console.error("verifyDigiLocker error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
