// src/pages/events/EventDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getEventByIdApi,
  toggleInterestApi,
  checkInEventApi,
} from "../../api/eventsApi";
import { useAuth } from "../../context/AuthContext.jsx";
import TrustScoreBadge from "../../components/common/TrustScoreBadge.jsx";

export default function EventDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interestLoading, setInterestLoading] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getEventByIdApi(id);
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleInterest = async () => {
    if (!user) {
      setMessage("Please login to mark interest.");
      return;
    }
    setInterestLoading(true);
    try {
      const res = await toggleInterestApi(id);
      setMessage(res.message);
      // refresh event
      const data = await getEventByIdApi(id);
      setEvent(data);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Something went wrong");
    } finally {
      setInterestLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user) {
      setMessage("Please login to check-in.");
      return;
    }
    setCheckInLoading(true);
    try {
      const res = await checkInEventApi(id);
      setMessage(res.message);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Check-in failed");
    } finally {
      setCheckInLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-slate-400">
        Loading event…
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-sm text-red-400">
        Event not found.
      </div>
    );
  }

  const interestedCount = event.interestedUsers?.length || 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {event.posterImageUrl && (
        <img
          src={event.posterImageUrl}
          alt={event.name}
          className="w-full max-h-80 object-cover rounded-3xl border border-slate-800"
        />
      )}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{event.name}</h1>
        <p className="text-sm text-slate-400">
          {event.type} • {event.location}, {event.city}
        </p>
        <p className="text-sm text-slate-400">
          {new Date(event.date).toLocaleString()} • Age:{" "}
          {event.ageSuitability || "18+"}
        </p>
        <p className="text-sm text-slate-400">
          Price: {event.priceRange || "Free"} • Capacity:{" "}
          {event.venueCapacity || "N/A"}
        </p>
        <p className="text-xs text-slate-500">
          👀 {event.viewsCount} views • ⭐ {interestedCount} interested • ✅{" "}
          {event.checkInsCount} check-ins
        </p>
        <p className="text-sm text-slate-200 mt-3">{event.description}</p>
        {event.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleInterest}
          disabled={interestLoading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-slate-950 text-sm font-semibold disabled:opacity-60"
        >
          {interestLoading ? "Updating…" : "I'm Interested"}
        </button>
        <button
          onClick={handleCheckIn}
          disabled={checkInLoading}
          className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-slate-100 text-sm disabled:opacity-60"
        >
          {checkInLoading ? "Checking in…" : "Scan QR / Check-In"}
        </button>
      </div>

      {message && <p className="text-xs text-slate-300">{message}</p>}
    </div>
  );
}
