// src/api/eventsApi.js
import api from "./apiClient";

export const getEventsApi = async (params = {}) => {
  const res = await api.get("/events", { params });
  return res.data; // array
};

export const getEventByIdApi = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const toggleInterestApi = async (id) => {
  const res = await api.post(`/events/${id}/interest`);
  return res.data; // { message, interested: true/false, interestCount }
};

export const checkInEventApi = async (id) => {
  const res = await api.post(`/events/${id}/check-in`);
  return res.data; // { message, trustScore, badge, checkInsCount }
};
