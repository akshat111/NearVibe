// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEventsApi } from "../api/eventsApi";
import { useAuth } from "../context/AuthContext.jsx";
import EventCard from "../components/events/EventCard.jsx";

const LAUNCH_CITIES = ["Delhi", "Gurgaon", "Bangalore"];

export default function HomePage() {
  const [city, setCity] = useState("Delhi");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getEventsApi({ city, upcoming: true });
        setEvents(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [city]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 md:px-6 py-16 md:py-24">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl"></div>
        <div className="absolute top-20 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              <span className="text-slate-100">Real events.</span>
              <br />
              <span className="text-slate-100">Real people.</span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Near you.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-md">
              Discover stand-up comedy, live music, café events, and meetups in
              your area. Join with a verified buddy so you never have to go
              alone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate("/events")}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold hover:from-pink-600 hover:to-cyan-600 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all"
              >
                🎉 Explore Events
              </button>
              <button
                onClick={() => navigate(user ? "/buddy" : "/login")}
                className="px-8 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 font-semibold hover:bg-slate-700/50 hover:border-slate-600 transition-all"
              >
                👥 Buddy Connect
              </button>
            </div>

            <p className="text-xs text-slate-500 pt-4">
              ✨ Phase 1: Delhi (Hauz Khas, Satyaniketan, Hudson Lane), Gurgaon
              (Cyberhub) & Bangalore (Koramangala)
            </p>
          </div>

          {/* Right - City Events Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-2xl opacity-30"></div>
            <div className="relative rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-slate-400 mb-3 font-medium">
                    Choose your city
                  </p>
                  <select
                    className="w-full rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 px-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    {LAUNCH_CITIES.map((c) => (
                      <option key={c} value={c}>
                        📍 {c}
                      </option>
                    ))}
                  </select>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block">
                      <div className="w-8 h-8 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-slate-400 mt-3">
                      Loading events...
                    </p>
                  </div>
                ) : events.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">
                    No upcoming events yet. Perfect time to be the first
                    organiser! 🚀
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {events.slice(0, 5).map((ev) => (
                      <div
                        key={ev._id}
                        className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-slate-800/50"
                        onClick={() => navigate(`/events/${ev._id}`)}
                      >
                        <p className="text-sm font-semibold text-slate-100 truncate">
                          {ev.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          📅 {new Date(ev.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          👀 {ev.viewsCount} | ⭐{" "}
                          {ev.interestedUsers?.length || 0}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {!user && (
                  <p className="text-xs text-slate-500 text-center pt-4">
                    <a
                      href="/login"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      Login
                    </a>{" "}
                    to unlock Buddy Connect & Trust Score
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 md:px-6 py-16 bg-slate-900/50 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why NearVibe?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎭",
                title: "Discover Events",
                desc: "Find stand-up, music, café events & more near you",
              },
              {
                icon: "👥",
                title: "Buddy Connect",
                desc: "Meet verified buddies with trust scores in your city",
              },
              {
                icon: "⭐",
                title: "Build Trust",
                desc: "Verify your identity & earn trust badges",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/50 transition-all hover:bg-slate-800/50"
              >
                <p className="text-4xl mb-3">{feature.icon}</p>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
