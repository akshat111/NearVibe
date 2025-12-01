// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import EventsListPage from "./pages/events/EventsListPage.jsx";
import EventDetailsPage from "./pages/events/EventDetailsPage.jsx";
import BuddyConnectPage from "./pages/buddy/BuddyConnectPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

// (future) Organiser & Admin dashboards
// import OrganiserDashboard from "./pages/organiser/OrganiserDashboard.jsx";
// import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-6 text-center text-sm text-slate-400">Loading…</div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="p-6 text-center text-red-400 text-sm">
        You don't have access to this page.
      </div>
    );
  }
  return children;
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />

          <Route
            path="/buddy"
            element={
              <ProtectedRoute roles={["user"]}>
                <BuddyConnectPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["user", "organiser", "admin"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* organiser/admin pages baad mein add kar sakte ho */}

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
