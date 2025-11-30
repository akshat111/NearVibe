const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },

    city: { type: String, default: "" },

    role: {
      type: String,
      enum: ["user", "organiser", "admin"],
      default: "user",
    },
    //trust System
    trustScore: { type: Number, default: 0 },
    badge: {
      type: String,
      enum: ["none", "silver", "gold", "platinum"],
      default: "none",
    },

    isPhoneVerified: { type: Boolean, default: false },
    isInstagramVerified: { type: Boolean, default: false },
    isDigiLockerVerified: { type: Boolean, default: false },

    instagramHandle: { type: String, default: "" },

     // ✅ check-in based trust (max 3 * 10 = 30)
    eventCheckIns: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
