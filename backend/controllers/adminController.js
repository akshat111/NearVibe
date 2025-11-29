const Event = require("../models/Event");
const User = require("../models/User");

// 1. Get all pending events
exports.getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ isApproved: false, isArchived: false })
      .populate("organiser", "name email city");

    res.json(events);
  } catch (err) {
    console.error("GetPendingEvents error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 2. Approve event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    event.isApproved = true;
    await event.save();

    res.json({ message: "Event approved", event });
  } catch (err) {
    console.error("ApproveEvent error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 3. Reject event
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    event.isApproved = false;
    event.isArchived = true;
    await event.save();

    res.json({ message: "Event rejected & archived" });
  } catch (err) {
    console.error("RejectEvent error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 4. Get all organisers
exports.getOrganisers = async (req, res) => {
  try {
    const organisers = await User.find({ role: "organiser" }).select("-password");

    res.json(organisers);
  } catch (err) {
    console.error("GetOrganisers error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 5. Approve organiser (real world flow)
exports.approveOrganiser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "organiser";
    await user.save();

    res.json({ message: "Organiser approved", user });
  } catch (err) {
    console.error("ApproveOrganiser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 6. Reject organiser
exports.rejectOrganiser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "user";
    await user.save();

    res.json({ message: "Organiser rejected", user });
  } catch (err) {
    console.error("RejectOrganiser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
