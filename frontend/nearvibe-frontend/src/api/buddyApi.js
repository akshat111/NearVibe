// src/api/buddyApi.js
import api from "./apiClient";

export const getBuddySuggestionsApi = async (params = {}) => {
  const res = await api.get("/buddies/suggestions", { params });
  return res.data; // array of users (name, city, trustScore, badge, instagramHandle, role)
};

export const getBuddyRequestsApi = async () => {
  const res = await api.get("/buddies/requests");
  return res.data; // { incoming, outgoing }
};

export const sendBuddyRequestApi = async (targetUserId) => {
  const res = await api.post(`/buddies/request/${targetUserId}`);
  return res.data;
};

export const acceptBuddyRequestApi = async (connectionId) => {
  const res = await api.post(`/buddies/accept/${connectionId}`);
  return res.data;
};

export const rejectBuddyRequestApi = async (connectionId) => {
  const res = await api.post(`/buddies/reject/${connectionId}`);
  return res.data;
};

export const blockUserApi = async (targetUserId) => {
  const res = await api.post(`/buddies/block/${targetUserId}`);
  return res.data;
};
