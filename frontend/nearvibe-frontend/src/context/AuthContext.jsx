// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { getMeApi, loginApi, registerApi, logoutApi } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // backend user object
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("nearvibe_token");
    if (!token) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const me = await getMeApi();
        setUser(me);
      } catch (err) {
        console.error("getMe failed", err?.response?.data || err.message);
        setUser(null);
        localStorage.removeItem("nearvibe_token");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (payload) => {
    const data = await loginApi(payload);
    setUser(data.user);
  };

  const register = async (payload) => {
    const data = await registerApi(payload);
    setUser(data.user);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
