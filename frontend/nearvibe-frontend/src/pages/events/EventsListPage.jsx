import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getEventsApi } from "../../api/eventsApi";
import EventCard from "../../components/events/EventCard";

export default function EventsListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const city = searchParams.get("city") || "";
  const type = searchParams.get("type") || "";
  const q = searchParams.get("q") || "";
  const upcoming = searchParams.get("upcoming") === "true";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = {};
        if (city) params.city = city;
        if (type) params.type = type;
        if (q) params.q = q;
        if (upcoming) params.upcoming = "true";

        const data = await getEventsApi(params);
        setEvents(data);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load events");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [city, type, q, upcoming]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newParams = {};
    if (formData.get("city")) newParams.city = formData.get("city");
    if (formData.get("type")) newParams.type = formData.get("type");
    if (formData.get("q")) newParams.q = formData.get("q");
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-50 mb-8">Events</h1>

        {/* Search & Filter */}
        <form
          onSubmit={handleSearch}
          className="mb-8 p-4 bg-slate-900 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search events..."
              className="px-4 py-2 bg-slate-800 text-slate-50 rounded border border-slate-700"
            />
            <input
              type="text"
              name="city"
              defaultValue={city}
              placeholder="City..."
              className="px-4 py-2 bg-slate-800 text-slate-50 rounded border border-slate-700"
            />
            <input
              type="text"
              name="type"
              defaultValue={type}
              placeholder="Event type..."
              className="px-4 py-2 bg-slate-800 text-slate-50 rounded border border-slate-700"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-slate-50 rounded hover:bg-blue-700 font-semibold"
            >
              Search
            </button>
          </div>
        </form>

        {/* Loading, Error, or Events */}
        {loading && <p className="text-slate-400">Loading events...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && events.length === 0 && (
          <p className="text-slate-400">No events found.</p>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
