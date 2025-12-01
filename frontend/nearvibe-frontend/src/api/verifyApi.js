// src/api/verifyApi.js
import api from "./apiClient";

export const verifyPhoneApi = async () => {
  const res = await api.post("/verify/phone");
  return res.data;
};

export const verifyInstagramApi = async () => {
  const res = await api.post("/verify/instagram");
  return res.data;
};

export const verifyDigiLockerApi = async () => {
  const res = await api.post("/verify/digilocker");
  return res.data;
};
