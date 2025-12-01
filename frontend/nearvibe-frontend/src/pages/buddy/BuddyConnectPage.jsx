// src/pages/buddy/BuddyConnectPage.jsx
import { useEffect, useState } from "react";
import {
  getBuddySuggestionsApi,
  getBuddyRequestsApi,
  acceptBuddyRequestApi,
  rejectBuddyRequestApi,
} from "../../api/buddyApi";
import { useAuth } from "../../context/AuthContext.jsx";
import BuddyCard from "../../components/buddy/BuddyCard.jsx";

export default function BuddyConnectPage() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);
  const [minTrust, setMinTrust] = useState(30);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [sugs, reqs] = await Promise.all([
          getBuddySuggestionsApi({ minTrust }),
          getBuddyRequestsApi(),
        ]);
        setSuggestions(sugs || []);
        setRequests(reqs || { incoming: [], outgoing: [] });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [minTrust]);

  const handleRequestAction = async (action, connectionId) => {
    try {
      if (action === "accept") {
        await acceptBuddyRequestApi(connectionId);
        alert("Request accepted!");
      } else if (action === "reject") {
        await rejectBuddyRequestApi(connectionId);
        alert("Request rejected!");
      }
      // Refresh requests
      const reqs = await getBuddyRequestsApi();
      setRequests(reqs || { incoming: [], outgoing: [] });
    } catch (err) {
      alert(err?.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 bg-slate-950 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Buddy Connect</h1>
          <p className="text-sm text-slate-400">
            Matching buddies in{" "}
            <span className="font-semibold text-slate-300">
              {user?.city || "your city"}
            </span>{" "}
            with at least {minTrust}+ trust score.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Minimum trust score:</span>
          <input
            type="number"
            value={minTrust}
            onChange={(e) => setMinTrust(Number(e.target.value) || 0)}
            className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-50"
          />
        </div>
      </header>

      {/* Buddy Suggestions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">
          Buddy suggestions
        </h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading suggestions…</p>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-slate-400">
            No suggestions right now. Try lowering trust filter or invite
            friends.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((b) => (
              <BuddyCard
                key={b._id}
                user={b}
                type="suggestion"
                onAction={() => {
                  setSuggestions(suggestions.filter((s) => s._id !== b._id));
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Pending Requests */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-50">
          Pending requests
        </h2>
        <p className="text-sm text-slate-400">
          Incoming: {requests.incoming?.length || 0} • Outgoing:{" "}
          {requests.outgoing?.length || 0}
        </p>

        {/* Incoming Requests */}
        {requests.incoming && requests.incoming.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">
              From others
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.incoming.map((conn) => {
                const requester =
                  conn.requestedBy._id === user._id ? conn.user2 : conn.user1;
                return (
                  <BuddyCard
                    key={conn._id}
                    user={requester}
                    type="incoming"
                    onAction={(action) => {
                      if (action === "accept") {
                        handleRequestAction("accept", conn._id);
                      } else if (action === "reject") {
                        handleRequestAction("reject", conn._id);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Outgoing Requests */}
        {requests.outgoing && requests.outgoing.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-300">
              Sent by you
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.outgoing.map((conn) => {
                const recipient =
                  conn.requestedBy._id === user._id ? conn.user2 : conn.user1;
                return (
                  <BuddyCard key={conn._id} user={recipient} type="outgoing" />
                );
              })}
            </div>
          </div>
        )}
      </section>

      <p className="text-xs text-slate-500">
        💡 You can send up to 25 messages before the other person accepts.
        Instagram is visible only after approval. Safety first: block & report
        always available.
      </p>
    </div>
  );
}
