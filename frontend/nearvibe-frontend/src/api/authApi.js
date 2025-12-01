// src/api/authApi.js
import api from "./apiClient";

export const registerApi = async (payload) => {
  const res = await api.post("/auth/register", payload);
  if (res.data.token) {
    localStorage.setItem("nearvibe_token", res.data.token);
  }
  return res.data;
};

export const loginApi = async ({ emailOrPhone, password }) => {
  const res = await api.post("/auth/login", { emailOrPhone, password });
  if (res.data.token) {
    localStorage.setItem("nearvibe_token", res.data.token);
  }
  return res.data;
};

export const getMeApi = async () => {
  const res = await api.get("/auth/me");
  return res.data; // full user object (without password)
};

export const logoutApi = async () => {
  localStorage.removeItem("nearvibe_token");
  // backend pe logout route nahi hai, so just clear token
  return true;
};
