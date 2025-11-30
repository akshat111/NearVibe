const BuddyConnection = require("../models/BuddyConnection");
const User = require("../models/User");

// helper: user1/user2 ko sorted store karo
const getSortedPair = (id1, id2) => {
  const a = id1.toString();
  const b = id2.toString();
  return a < b ? [a, b] : [b, a];
};

// GET /api/buddies/suggestions
// same city, min trust score, already friend/blocked nahi
exports.getSuggestions = async (req, res) => {
  try {
    const currentUser = req.user;

    if (!currentUser.city) {
      return res.status(400).json({
        message: "Please set your city to get buddy suggestions",
      });
    }

    const minTrust = Number(req.query.minTrust || 30); // default 30

    // sab possible users, same city, trust >= minTrust
    let candidates = await User.find({
      _id: { $ne: currentUser._id },
      city: currentUser.city,
      trustScore: { $gte: minTrust },
    }).select("name city trustScore badge instagramHandle role");

    if (!candidates.length) {
      return res.json([]);
    }

    // unke sath existing connections nikalo
    const candidateIds = candidates.map((u) => u._id);

    const connections = await BuddyConnection.find({
      $or: [
        { user1: currentUser._id, user2: { $in: candidateIds } },
        { user2: currentUser._id, user1: { $in: candidateIds } },
      ],
    });

    const blockedOrConnectedIds = new Set();

    connections.forEach((conn) => {
      if (["accepted", "blocked"].includes(conn.status)) {
        blockedOrConnectedIds.add(conn.user1.toString());
        blockedOrConnectedIds.add(conn.user2.toString());
      }
    });

    // filter out jo already friend/blocked hain
    const filtered = candidates.filter(
      (u) => !blockedOrConnectedIds.has(u._id.toString())
    );

    res.json(filtered);
  } catch (err) {
    console.error("getSuggestions error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/buddies/request/:targetUserId
exports.sendRequest = async (req, res) => {
  try {
    const currentUser = req.user;
    const targetId = req.params.targetUserId;

    if (currentUser._id.toString() === targetId.toString()) {
      return res.status(400).json({ message: "You can't buddy yourself 😂" });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const [user1, user2] = getSortedPair(currentUser._id, targetId);

    let existing = await BuddyConnection.findOne({ user1, user2 });

    if (existing) {
      if (existing.status === "accepted") {
        return res
          .status(400)
          .json({ message: "You are already buddies with this user" });
      }
      if (existing.status === "blocked") {
        return res
          .status(400)
          .json({ message: "You cannot send request, one of you blocked" });
      }
      if (existing.status === "pending") {
        return res
          .status(400)
          .json({ message: "Buddy request is already pending" });
      }
    }

    const conn = await BuddyConnection.create({
      user1,
      user2,
      status: "pending",
      requestedBy: currentUser._id,
    });

    res.status(201).json({
      message: "Buddy request sent",
      connection: conn,
    });
  } catch (err) {
    console.error("sendRequest error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/buddies/requests
exports.getRequests = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const pending = await BuddyConnection.find({
      status: "pending",
      $or: [{ user1: userId }, { user2: userId }],
    }).populate("user1 user2", "name city trustScore badge instagramHandle");

    const incoming = [];
    const outgoing = [];

    pending.forEach((conn) => {
      const isRequester = conn.requestedBy.toString() === userId;
      if (isRequester) outgoing.push(conn);
      else incoming.push(conn);
    });

    res.json({ incoming, outgoing });
  } catch (err) {
    console.error("getRequests error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/buddies/accept/:connectionId
exports.acceptRequest = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const connectionId = req.params.connectionId;

    const conn = await BuddyConnection.findById(connectionId);

    if (!conn) {
      return res.status(404).json({ message: "Connection not found" });
    }
    if (conn.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    // jisne request receive ki hai woh hi accept kar sakta hai
    const otherId =
      conn.requestedBy.toString() === conn.user1.toString()
        ? conn.user2.toString()
        : conn.user1.toString();

    if (userId !== otherId) {
      return res
        .status(403)
        .json({ message: "Only receiver can accept this request" });
    }

    conn.status = "accepted";
    await conn.save();

    res.json({ message: "Buddy request accepted", connection: conn });
  } catch (err) {
    console.error("acceptRequest error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/buddies/reject/:connectionId
exports.rejectRequest = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const connectionId = req.params.connectionId;

    const conn = await BuddyConnection.findById(connectionId);

    if (!conn) {
      return res.status(404).json({ message: "Connection not found" });
    }
    if (conn.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    // sirf receiver ya requester dono reject kar sakte hain (safe)
    const isParticipant =
      conn.user1.toString() === userId || conn.user2.toString() === userId;

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "You are not part of this connection" });
    }

    conn.status = "rejected";
    await conn.save();

    res.json({ message: "Buddy request rejected", connection: conn });
  } catch (err) {
    console.error("rejectRequest error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/buddies
exports.getMyBuddies = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const connections = await BuddyConnection.find({
      status: "accepted",
      $or: [{ user1: userId }, { user2: userId }],
    }).populate("user1 user2", "name city trustScore badge instagramHandle");

    const buddies = connections.map((conn) => {
      const u1 = conn.user1;
      const u2 = conn.user2;
      const other = u1._id.toString() === userId ? u2 : u1;

      return {
        _id: other._id,
        name: other.name,
        city: other.city,
        trustScore: other.trustScore,
        badge: other.badge,
        instagramHandle: other.instagramHandle,
        connectionId: conn._id,
      };
    });

    res.json(buddies);
  } catch (err) {
    console.error("getMyBuddies error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/buddies/block/:targetUserId
exports.blockUser = async (req, res) => {
  try {
    const currentUser = req.user;
    const targetId = req.params.targetUserId;

    if (currentUser._id.toString() === targetId.toString()) {
      return res.status(400).json({ message: "You can't block yourself" });
    }

    const [user1, user2] = getSortedPair(currentUser._id, targetId);

    let conn = await BuddyConnection.findOne({ user1, user2 });

    if (!conn) {
      conn = await BuddyConnection.create({
        user1,
        user2,
        status: "blocked",
        requestedBy: currentUser._id,
        blockedBy: currentUser._id,
      });
    } else {
      conn.status = "blocked";
      conn.blockedBy = currentUser._id;
      await conn.save();
    }

    res.json({ message: "User blocked", connection: conn });
  } catch (err) {
    console.error("blockUser error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
