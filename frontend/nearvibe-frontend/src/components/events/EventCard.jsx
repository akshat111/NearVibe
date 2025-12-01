// src/components/events/EventCard.jsx
import { Link } from "react-router-dom";

export default function EventCard({ event, compact = false }) {
  const interestedCount = event.interestedUsers?.length || 0;

  if (compact) {
    return (
      <Link
        to={`/events/${event._id}`}
        className="group block p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all"
      >
        <p className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 truncate">
          {event.name}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          📅 {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-xs text-slate-500">
          👀 {event.viewsCount} | ⭐ {interestedCount}
        </p>
      </Link>
    );
  }

  return (
    <Link
      to={`/events/${event._id}`}
      className="group relative overflow-hidden rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 hover:from-slate-800/50 hover:to-slate-900/50 backdrop-blur transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
    >
      {/* Image */}
      {event.posterImageUrl && (
        <div className="relative h-40 md:h-48 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          <img
            src={event.posterImageUrl}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <div className="p-4 md:p-6 space-y-3">
        {/* Type Badge */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300">
            {event.type}
          </span>
          {event.isApproved && (
            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
              ✓ Live
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {event.name}
        </h3>

        {/* Location & Date */}
        <div className="space-y-2 text-sm">
          <p className="text-slate-400 flex items-center gap-2">
            📍 {event.location}
          </p>
          <p className="text-slate-400 flex items-center gap-2">
            📅{" "}
            {new Date(event.date).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-slate-400 flex items-center gap-2">
            💰 {event.priceRange}
          </p>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-slate-700/50 text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/30 text-xs text-slate-400">
          <span>👀 {event.viewsCount} views</span>
          <span>⭐ {interestedCount} interested</span>
        </div>
      </div>
    </Link>
  );
}
