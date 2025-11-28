const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },          // Event name
    type: { type: String, required: true, trim: true },          // standup, music, cafe night, etc.
    description: { type: String, default: "" },

    date: { type: Date, required: true },
    location: { type: String, required: true },                  // ex: Hauz Khas Social
    city: { type: String, required: true },                      // Delhi, Gurgaon, Bangalore
    mapLink: { type: String, default: "" },

    priceRange: { type: String, default: "Free" },               // "Free", "₹200–₹500"
    venueCapacity: { type: Number, default: 0 },

    posterImageUrl: { type: String, default: "" },

    tags: [{ type: String, trim: true }],                        // ["music", "nightlife", "college"]
    ageSuitability: { type: String, default: "18+" },            // "All", "16+", "18+"

    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isApproved: { type: Boolean, default: false },               // admin approval
    isArchived: { type: Boolean, default: false },

    viewsCount: { type: Number, default: 0 },
    interestedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    checkInsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
