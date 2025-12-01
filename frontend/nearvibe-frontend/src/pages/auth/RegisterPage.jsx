// src/pages/auth/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
  });
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-xl font-bold mb-4">
        Create your NearVibe account ✨
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 text-slate-300">Name</label>
          <input
            name="name"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-slate-300">Email</label>
          <input
            name="email"
            type="email"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-slate-300">Phone</label>
          <input
            name="phone"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-slate-300">City</label>
          <input
            name="city"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
            value={form.city}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1 text-slate-300">Password</label>
          <input
            name="password"
            type="password"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-slate-950 font-semibold"
        >
          Sign up
        </button>
      </form>
      <p className="mt-4 text-xs text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-cyan-300">
          Login
        </Link>
      </p>
    </div>
  );
}
