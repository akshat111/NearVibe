// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ emailOrPhone, password });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-4">Welcome back 👋</h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 text-slate-300">Email or phone</label>
          <input
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-slate-300">Password</label>
          <input
            type="password"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-slate-950 font-semibold"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-xs text-slate-400">
        New to NearVibe?{" "}
        <Link to="/register" className="text-cyan-300">
          Create an account
        </Link>
      </p>
    </div>
  );
}
