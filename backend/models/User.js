const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    city: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    interests: [
      {
        type: String,
        trim: true,
      },
    ],

    // NearVibe specific
    instagramHandle: {
      type: String,
      default: "",
    },
    trustScore: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      enum: ["none", "silver", "gold", "platinum"],
      default: "none",
    },

    // verification flags
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isInstagramVerified: {
      type: Boolean,
      default: false,
    },
    isDigiLockerVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "organiser", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
