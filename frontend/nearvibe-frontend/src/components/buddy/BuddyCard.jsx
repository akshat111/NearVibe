import { useState } from "react";
import { blockUserApi, sendBuddyRequestApi } from "../../api/buddyApi";
import TrustScoreBadge from "../common/TrustScoreBadge";

export default function BuddyCard({ user, onAction, type = "suggestion" }) {
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    try {
      setLoading(true);
      await sendBuddyRequestApi(user._id);
      alert("Buddy request sent! 👋");
      onAction?.("sent");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!confirm("Are you sure you want to block this user?")) return;
    try {
      setLoading(true);
      await blockUserApi(user._id);
      alert("User blocked!");
      onAction?.("blocked");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to block user");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    onAction?.("accept", user._id);
  };

  const handleReject = () => {
    onAction?.("reject", user._id);
  };

  const getBadgeColor = () => {
    if (user.badge === "platinum") return "from-emerald-500 to-cyan-500";
    if (user.badge === "gold") return "from-yellow-500 to-orange-500";
    if (user.badge === "silver") return "from-slate-300 to-slate-400";
    return "from-slate-600 to-slate-700";
  };

  return (
    <div className="relative group overflow-hidden rounded-xl border border-slate-700/50 hover:border-purple-500/50 bg-gradient-to-br from-slate-800/40 to-slate-900/40 hover:from-slate-800/60 hover:to-slate-900/60 backdrop-blur transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10 group-hover:from-purple-500/20 group-hover:to-cyan-500/20 transition-all"></div>

      <div className="p-5 space-y-4">
        {/* Header with Avatar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getBadgeColor()} shadow-lg flex items-center justify-center font-bold text-white text-lg`}
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-50">{user.name}</h3>
                <p className="text-xs text-slate-400">📍 {user.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/40 border border-slate-600/50">
          <span
            className={`w-2 h-2 rounded-full bg-gradient-to-r ${getBadgeColor()}`}
          ></span>
          <span className="text-xs font-semibold text-slate-300">
            {user.badge === "platinum"
              ? "🏆 Platinum"
              : user.badge === "gold"
              ? "🥇 Gold"
              : user.badge === "silver"
              ? "🥈 Silver"
              : "⭐ New"}
          </span>
          <span className="text-xs text-slate-400 ml-1">
            {user.trustScore}pts
          </span>
        </div>

        {/* Instagram Handle */}
        {user.instagramHandle && (
          <p className="text-sm text-slate-400">📷 @{user.instagramHandle}</p>
        )}

        {/* Description/Bio placeholder */}
        {type === "suggestion" && (
          <p className="text-sm text-slate-300 line-clamp-2">
            {user.role === "organiser"
              ? "🎤 Event Organiser"
              : "👤 Looking for buddies"}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-slate-700/30">
          {type === "suggestion" && (
            <>
              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/30 transition-all"
              >
                ➕ Add Buddy
              </button>
              <button
                onClick={handleBlock}
                disabled={loading}
                className="px-3 py-2.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 text-red-300 text-sm transition-all disabled:opacity-50"
              >
                🚫
              </button>
            </>
          )}

          {type === "incoming" && (
            <>
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30 transition-all"
              >
                ✓ Accept
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-red-900/40 hover:bg-red-900/60 border border-red-700/50 text-red-300 transition-all"
              >
                ✕ Reject
              </button>
            </>
          )}

          {type === "outgoing" && (
            <button
              disabled
              className="w-full px-4 py-2.5 rounded-lg bg-slate-700/50 text-slate-400 text-sm font-semibold"
            >
              ⏳ Request Sent
            </button>
          )}

          {type === "connected" && (
            <button
              onClick={handleBlock}
              className="w-full px-4 py-2.5 rounded-lg bg-red-900/30 hover:bg-red-900/50 border border-red-700/50 text-red-300 text-sm transition-all"
            >
              🚫 Block
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
