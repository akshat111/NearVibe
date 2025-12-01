// src/pages/profile/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import TrustScoreBadge from "../../components/common/TrustScoreBadge.jsx";
import {
  verifyPhoneApi,
  verifyInstagramApi,
  verifyDigiLockerApi,
} from "../../api/verifyApi";

export default function ProfilePage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [loadingType, setLoadingType] = useState("");

  if (!user) return null;

  const handleVerify = async (type) => {
    try {
      setLoadingType(type);
      setMessage("");
      let res;
      if (type === "phone") res = await verifyPhoneApi();
      else if (type === "instagram") res = await verifyInstagramApi();
      else if (type === "digilocker") res = await verifyDigiLockerApi();

      setMessage(res.message);
      // ideally yahan /auth/me ko dobara fetch karke context update karna chahiye
    } catch (err) {
      setMessage(err?.response?.data?.message || "Verification failed");
    } finally {
      setLoadingType("");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-4">
      <h1 className="text-xl font-bold">Your Profile</h1>
      <div className="space-y-1 text-sm">
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>City: {user.city}</p>
        <p>Role: {user.role}</p>
      </div>

      <TrustScoreBadge trustScore={user.trustScore} badge={user.badge} />

      <div className="space-y-2 text-sm mt-4">
        <p className="font-semibold">Verification</p>
        <button
          onClick={() => handleVerify("phone")}
          disabled={loadingType === "phone"}
          className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs disabled:opacity-60"
        >
          {loadingType === "phone"
            ? "Verifying phone…"
            : "Mark phone verified (demo)"}
        </button>
        <button
          onClick={() => handleVerify("instagram")}
          disabled={loadingType === "instagram"}
          className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs disabled:opacity-60"
        >
          {loadingType === "instagram"
            ? "Verifying Instagram…"
            : "Mark Instagram linked (demo)"}
        </button>
        <button
          onClick={() => handleVerify("digilocker")}
          disabled={loadingType === "digilocker"}
          className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs disabled:opacity-60"
        >
          {loadingType === "digilocker"
            ? "Verifying DigiLocker…"
            : "Mark DigiLocker verified (demo)"}
        </button>
      </div>

      {message && <p className="text-xs text-slate-400">{message}</p>}
    </div>
  );
}
