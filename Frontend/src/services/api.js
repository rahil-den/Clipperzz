import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── Users ───────────────────────────────────────────────────────────────────

export const createUser = async (userData) => {
  const res = await axios.post(`${BASE_URL}/users`, userData);
  return res.data;
};

export const getUsers = async () => {
  const res = await axios.get(`${BASE_URL}/users`);
  return res.data;
};

// ─── Videos ──────────────────────────────────────────────────────────────────

export const createVideo = async (videoData) => {
  const res = await axios.post(`${BASE_URL}/videos`, videoData);
  return res.data;
};

export const getVideos = async () => {
  const res = await axios.get(`${BASE_URL}/videos`);
  return res.data;
};

// ─── Clips ───────────────────────────────────────────────────────────────────

export const createClip = async (clipData) => {
  const res = await axios.post(`${BASE_URL}/clips`, clipData);
  return res.data;
};

export const getClips = async () => {
  const res = await axios.get(`${BASE_URL}/clips`);
  return res.data;
};

// ─── Subscriptions ───────────────────────────────────────────────────────────

export const getAllSubscriptions = async () => {
  const res = await axios.get(`${BASE_URL}/subscriptions`);
  return res.data;
};

// ─── Usage ───────────────────────────────────────────────────────────────────

export const getAllUsage = async () => {
  const res = await axios.get(`${BASE_URL}/usage`);
  return res.data;
};
