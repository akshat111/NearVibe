const mongoose = require("mongoose");

const buddyConnectionSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // pending / accepted / rejected / blocked
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "blocked"],
      default: "pending",
    },

    // jisne request bheji
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // block kisne kiya (agar status = blocked)
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

// ek hi pair ke beech multiple records na ho
buddyConnectionSchema.index(
  { user1: 1, user2: 1 },
  { unique: true }
);

const BuddyConnection = mongoose.model(
  "BuddyConnection",
  buddyConnectionSchema
);

module.exports = BuddyConnection;
