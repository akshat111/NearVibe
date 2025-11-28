const requireOrganiser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role === "organiser" || req.user.role === "admin") {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Only organisers or admins can perform this action" });
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Only admin can perform this action" });
};

module.exports = { requireOrganiser, requireAdmin };
