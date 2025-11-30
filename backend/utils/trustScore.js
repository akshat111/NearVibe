
const TRUST_POINTS = {
  phone: 10,
  instagram: 20,
  digilocker: 30,
  checkIn: 10,
};

const updateBadge = (user) => {
  const score = user.trustScore || 0;

  if (score >= 90) user.badge = "platinum";
  else if (score >= 80) user.badge = "gold";
  else if (score >= 50) user.badge = "silver";
  else user.badge = "none";

  return user;
};

const addTrustPoints = (user, points) => {
  user.trustScore = (user.trustScore || 0) + points;
  updateBadge(user);
};

module.exports = {
  TRUST_POINTS,
  updateBadge,
  addTrustPoints,
};
