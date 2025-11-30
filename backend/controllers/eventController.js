const Event = require("../models/Event");
const User = require("../models/User");
const { TRUST_POINTS, addTrustPoints } = require("../utils/trustScore");

// POST /api/events  (organiser only)
exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      date,
      location,
      city,
      mapLink,
      priceRange,
      venueCapacity,
      tags,
      ageSuitability,
      posterImageUrl,
    } = req.body;

    if (!name || !type || !date || !location || !city) {
      return res
        .status(400)
        .json({ message: "name, type, date, location, city are required" });
    }

    const event = await Event.create({
      name,
      type,
      description,
      date,
      location,
      city,
      mapLink,
      priceRange,
      venueCapacity,
      tags,
      ageSuitability,
      posterImageUrl,
      organiser: req.user._id,
      // isApproved: false  // default
    });

    res.status(201).json({
      message: "Event created, pending admin approval",
      event,
    });
  } catch (error) {
    console.error("CreateEvent error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/events  (public: list + filters)
exports.getEvents = async (req, res) => {
  try {
    const { city, type, q, upcoming, past } = req.query;

    const filter = { isArchived: false, isApproved: true };

    if (city) filter.city = city;
    if (type) filter.type = type;

    // search by name / description
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const now = new Date();
    if (upcoming === "true") {
      filter.date = { $gte: now };
    }
    if (past === "true") {
      filter.date = { $lt: now };
    }

    const events = await Event.find(filter)
      .populate("organiser", "name city")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    console.error("GetEvents error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/events/:id  (public: detail)
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organiser",
      "name city"
    );

    if (!event || event.isArchived) {
      return res.status(404).json({ message: "Event not found" });
    }

    // view count increment
    event.viewsCount += 1;
    await event.save();

    res.json(event);
  } catch (error) {
    console.error("GetEventById error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/events/my  (organiser: apne events)
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organiser: req.user._id }).sort({
      date: 1,
    });
    res.json(events);
  } catch (error) {
    console.error("GetMyEvents error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/events/:id  (organiser: update)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organiser.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only edit your own events" });
    }

    const updatableFields = [
      "name",
      "type",
      "description",
      "date",
      "location",
      "city",
      "mapLink",
      "priceRange",
      "venueCapacity",
      "tags",
      "ageSuitability",
      "posterImageUrl",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    const updated = await event.save();

    res.json({
      message: "Event updated",
      event: updated,
    });
  } catch (error) {
    console.error("UpdateEvent error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/events/:id/interest  (user: mark/unmark interest)
exports.toggleInterest = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event || event.isArchived) {
      return res.status(404).json({ message: "Event not found" });
    }

    const userId = req.user._id.toString();
    const already = event.interestedUsers
      .map((id) => id.toString())
      .includes(userId);

    if (already) {
      event.interestedUsers = event.interestedUsers.filter(
        (id) => id.toString() !== userId
      );
      await event.save();
      return res.json({ message: "Removed interest", event });
    } else {
      event.interestedUsers.push(req.user._id);
      await event.save();
      return res.json({ message: "Marked interest", event });
    }
  } catch (error) {
    console.error("ToggleInterest error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/events/:id/check-in  (user)
exports.checkInToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event || event.isArchived) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.isApproved) {
      return res.status(400).json({ message: "Event not yet approved" });
    }

    // user already checked-in?
    const alreadyCheckedIn = event.checkedInUsers
      .map((id) => id.toString())
      .includes(userId.toString());

    if (alreadyCheckedIn) {
      return res.status(400).json({ message: "Already checked in for this event" });
    }

    // add check-in to event
    event.checkedInUsers.push(userId);
    event.checkInsCount = (event.checkInsCount || 0) + 1;
    await event.save();

    // update user's trust
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // max 3 check-ins for trust (10 * 3 = 30)
    if ((user.eventCheckIns || 0) < 3) {
      user.eventCheckIns = (user.eventCheckIns || 0) + 1;
      addTrustPoints(user, TRUST_POINTS.checkIn);
      await user.save();

      return res.json({
        message: "Check-in successful, trust score updated",
        trustScore: user.trustScore,
        badge: user.badge,
        checkInsCount: event.checkInsCount,
      });
    } else {
      // trust score max ho chuka for check-ins, but check-in allowed
      await user.save();
      return res.json({
        message: "Check-in successful (max trust from check-ins already reached)",
        trustScore: user.trustScore,
        badge: user.badge,
        checkInsCount: event.checkInsCount,
      });
    }
  } catch (err) {
    console.error("checkInToEvent error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};