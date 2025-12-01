// src/components/layout/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-all ${
      isActive
        ? "text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text"
        : "text-slate-400 hover:text-slate-100"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-gradient-to-b from-slate-950/90 to-slate-950/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:shadow-xl group-hover:shadow-purple-400/60 transition-all">
            <span className="text-white font-extrabold text-lg">N</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              NearVibe
            </p>
            <p className="text-xs text-slate-500">Find your vibe, near you</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/events" className={linkClass}>
            🎉 Events
          </NavLink>
          <NavLink to="/buddy" className={linkClass}>
            👥 Buddy Connect
          </NavLink>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                👤 {user.name?.split(" ")[0] || "Profile"}
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-300 hover:text-slate-100 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-pink-500 to-cyan-500 text-white hover:from-pink-600 hover:to-cyan-600 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transition-all"
              >
                Join NearVibe
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle (optional) */}
        <div className="md:hidden flex items-center gap-2">
          <NavLink to="/events" className={linkClass}>
            Events
          </NavLink>
        </div>
      </div>
    </header>
  );
}
