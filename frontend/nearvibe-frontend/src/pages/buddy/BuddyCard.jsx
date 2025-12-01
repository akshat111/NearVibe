// src/components/buddy/BuddyCard.jsx
import TrustScoreBadge from "../common/TrustScoreBadge.jsx";
import { useState } from "react";
import { sendBuddyRequestApi, blockUserApi } from "../../api/buddyApi";

export default function BuddyCard({ buddy }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleRequest = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await sendBuddyRequestApi(buddy._id);
      setMessage(res.message);
      setStatus("requested");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Unable to send request");
      setStatus("idle");
    }
  };

  const handleBlock = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await blockUserApi(buddy._id);
      setMessage(res.message);
      setStatus("blocked");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to block");
      setStatus("idle");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold">{buddy.name}</p>
          <p className="text-xs text-slate-400">{buddy.city}</p>
        </div>
        <TrustScoreBadge trustScore={buddy.trustScore} badge={buddy.badge} />
      </div>
      {buddy.instagramHandle && (
        <p className="text-xs text-slate-400">
          Instagram: @{buddy.instagramHandle} (visible after approval)
        </p>
      )}
      <div className="flex gap-2 text-xs mt-2">
        <button
          disabled={
            status === "loading" ||
            status === "requested" ||
            status === "blocked"
          }
          onClick={handleRequest}
          className="px-3 py-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-slate-950 disabled:opacity-60"
        >
          {status === "requested" ? "Request sent" : "Send buddy request"}
        </button>
        <button
          disabled={status === "loading" || status === "blocked"}
          onClick={handleBlock}
          className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 disabled:opacity-60"
        >
          {status === "blocked" ? "Blocked" : "Block"}
        </button>
      </div>
      {message && <p className="text-xs text-slate-400 mt-1">{message}</p>}
    </div>
  );
}
