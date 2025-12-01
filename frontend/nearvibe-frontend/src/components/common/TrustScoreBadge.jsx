// src/components/common/TrustScoreBadge.jsx
export default function TrustScoreBadge({ trustScore = 0, badge = "none" }) {
  let label = "New";
  let bgColor = "bg-slate-700/50";
  let icon = "⭐";

  if (badge === "silver") {
    label = "Silver";
    bgColor =
      "bg-gradient-to-r from-slate-400/30 to-slate-300/30 border border-slate-300/50";
    icon = "🥈";
  } else if (badge === "gold") {
    label = "Gold";
    bgColor =
      "bg-gradient-to-r from-yellow-500/30 to-orange-400/30 border border-yellow-400/50";
    icon = "🥇";
  } else if (badge === "platinum") {
    label = "Platinum";
    bgColor =
      "bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 border border-emerald-400/50";
    icon = "🏆";
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-slate-700/40 to-slate-600/40 border border-slate-600/50 shadow-sm">
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-bold text-slate-100 ${bgColor}`}
      >
        {icon} {label}
      </span>
      <span className="text-xs text-slate-400">
        <span className="font-semibold text-slate-300">{trustScore}</span> pts
      </span>
    </div>
  );
}
