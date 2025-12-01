import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getEventByIdApi,
  toggleInterestApi,
  checkInEventApi,
} from "../../api/eventsApi";
import TrustScoreBadge from "../../components/common/TrustScoreBadge";

export default function EventDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInterested, setIsInterested] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventByIdApi(id);
        setEvent(data);
        if (user && data.interestedUsers?.includes(user.id)) {
          setIsInterested(true);
        }
        if (user && data.checkedInUsers?.includes(user.id)) {
          setIsCheckedIn(true);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load event");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleToggleInterest = async () => {
    try {
      await toggleInterestApi(id);
      setIsInterested(!isInterested);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to toggle interest");
    }
  };

  const handleCheckIn = async () => {
    try {
      const res = await checkInEventApi(id);
      setIsCheckedIn(true);
      alert(
        `Check-in successful! Trust score: ${res.trustScore}, Badge: ${res.badge}`
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to check in");
    }
  };

  if (loading)
    return <div className="p-6 text-center text-slate-400">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-400">{error}</div>;
  if (!event)
    return (
      <div className="p-6 text-center text-slate-400">Event not found</div>
    );

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Event Header */}
        <div className="mb-8">
          {event.posterImageUrl && (
            <img
              src={event.posterImageUrl}
              alt={event.name}
              className="w-full h-80 object-cover rounded-lg mb-6"
            />
          )}

          <h1 className="text-4xl font-bold text-slate-50 mb-4">
            {event.name}
          </h1>

          {/* Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 mb-6">
            <div>
              <p className="text-slate-400">📍 Location</p>
              <p className="text-lg">{event.location}</p>
            </div>
            <div>
              <p className="text-slate-400">📅 Date</p>
              <p className="text-lg">
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-slate-400">🎭 Type</p>
              <p className="text-lg">{event.type}</p>
            </div>
            <div>
              <p className="text-slate-400">💰 Price</p>
              <p className="text-lg">{event.priceRange}</p>
            </div>
            <div>
              <p className="text-slate-400">👥 Capacity</p>
              <p className="text-lg">{event.venueCapacity || "N/A"}</p>
            </div>
            <div>
              <p className="text-slate-400">👀 Views</p>
              <p className="text-lg">{event.viewsCount}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-slate-400 mb-2">Description</p>
            <p className="text-slate-300">
              {event.description || "No description"}
            </p>
          </div>

          {/* Organiser Info */}
          {event.organiser && (
            <div className="mb-6 p-4 bg-slate-900 rounded">
              <p className="text-slate-400 mb-2">Organised by</p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-slate-50 font-semibold">
                    {event.organiser.name}
                  </p>
                  <p className="text-slate-400">{event.organiser.city}</p>
                </div>
                <TrustScoreBadge
                  trustScore={event.organiser.trustScore}
                  badge={event.organiser.badge}
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="mb-6">
              <p className="text-slate-400 mb-2">Tags</p>
              <div className="flex gap-2 flex-wrap">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {user && (
            <div className="flex gap-4">
              <button
                onClick={handleToggleInterest}
                className={`px-6 py-2 rounded font-semibold ${
                  isInterested
                    ? "bg-red-600 text-slate-50 hover:bg-red-700"
                    : "bg-blue-600 text-slate-50 hover:bg-blue-700"
                }`}
              >
                {isInterested ? "❤️ Interested" : "🤍 Mark Interested"}
              </button>

              {event.isApproved && (
                <button
                  onClick={handleCheckIn}
                  disabled={isCheckedIn}
                  className={`px-6 py-2 rounded font-semibold ${
                    isCheckedIn
                      ? "bg-green-700 text-slate-50 cursor-not-allowed opacity-50"
                      : "bg-green-600 text-slate-50 hover:bg-green-700"
                  }`}
                >
                  {isCheckedIn ? "✓ Checked In" : "📍 Check In"}
                </button>
              )}
            </div>
          )}

          {!user && (
            <p className="text-slate-400">
              <a href="/login" className="text-blue-400 hover:underline">
                Login
              </a>{" "}
              to mark interest or check in
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
