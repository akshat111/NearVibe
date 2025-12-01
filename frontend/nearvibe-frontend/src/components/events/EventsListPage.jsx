// src/pages/events/EventsListPage.jsx
import { useEffect, useState } from "react";
import { getEventsApi } from "../../api/eventsApi";
import EventCard from "../../components/events/EventCard.jsx";

export default function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getEventsApi({ city, type, q, upcoming: true });
        setEvents(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [city, type, q]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-xl font-bold">Discover Events</h1>
        <div className="flex flex-wrap gap-2 text-xs">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or description"
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (Delhi, Gurgaon, Bangalore…)"
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1"
          >
            <option value="">All types</option>
            <option value="standup">Stand-up</option>
            <option value="music">Music</option>
            <option value="cafe-night">Café Night</option>
            <option value="tech-meetup">Tech Meetup</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading events…</p>
      ) : events.length === 0 ? (
        <p className="text-sm text-slate-400">No events found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </div>
      )}
    </div>
  );
}
