import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/login") || error.config?.url?.includes("/auth/register");
    
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  // No token on register — user must verify email first
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const verifyEmail = async (token) => {
  const res = await api.get(`/auth/verify-email?token=${token}`);
  // Backend returns a JWT so the user is logged in right after verification
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const resendVerification = async (email) => {
  const res = await api.post("/auth/resend-verification", { email });
  return res.data;
};

export const googleLogin = async (credential) => {
  const res = await api.post("/auth/google", { credential });
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};
// ─── Users ───────────────────────────────────────────────────────────────────

export const createUser = async (userData) => {
  const res = await api.post("/users", userData);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const updateUser = async (id, userData) => {
  const res = await api.put(`/users/${id}`, userData);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

// ─── Videos ──────────────────────────────────────────────────────────────────

export const createVideo = async (videoData) => {
  const res = await api.post("/videos", videoData);
  return res.data;
};

export const getVideos = async () => {
  const res = await api.get("/videos");
  return res.data;
};

export const getVideoById = async (id) => {
  const res = await api.get(`/videos/${id}`);
  return res.data;
};

export const updateVideo = async (id, videoData) => {
  const res = await api.put(`/videos/${id}`, videoData);
  return res.data;
};

export const deleteVideo = async (id) => {
  const res = await api.delete(`/videos/${id}`);
  return res.data;
};

// ─── Clips ───────────────────────────────────────────────────────────────────

export const createClip = async (clipData) => {
  const res = await api.post("/clips", clipData);
  return res.data;
};

export const getClips = async () => {
  const res = await api.get("/clips");
  return res.data;
};

export const getClipById = async (id) => {
  const res = await api.get(`/clips/${id}`);
  return res.data;
};

export const updateClip = async (id, clipData) => {
  const res = await api.put(`/clips/${id}`, clipData);
  return res.data;
};

export const deleteClip = async (id) => {
  const res = await api.delete(`/clips/${id}`);
  return res.data;
};

// ─── Subscriptions ───────────────────────────────────────────────────────────

export const getAllSubscriptions = async () => {
  const res = await api.get("/subscriptions");
  return res.data;
};

export const getMySubscription = async () => {
  const res = await api.get("/subscriptions/me");
  return res.data;
};

export const updateSubscription = async (id, subscriptionData) => {
  const res = await api.put(`/subscriptions/${id}`, subscriptionData);
  return res.data;
};

// ─── Stripe Billing ──────────────────────────────────────────────────────────

export const createStripeCheckoutSession = async (plan) => {
  const res = await api.post("/stripe/create-checkout-session", { plan });
  return res.data;
};

export const createStripePortalSession = async () => {
  const res = await api.post("/stripe/create-portal-session");
  return res.data;
};

// ─── Usage ───────────────────────────────────────────────────────────────────

export const getAllUsage = async () => {
  const res = await api.get("/usage");
  return res.data;
};

export const getMyUsage = async () => {
  const res = await api.get("/usage/me");
  return res.data;
};

export const updateUsage = async (id, usageData) => {
  const res = await api.put(`/usage/${id}`, usageData);
  return res.data;
};

// ─── Jobs ────────────────────────────────────────────────────────────────────

export const getAllJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

export const getMyJobs = async () => {
  const res = await api.get("/jobs/me");
  return res.data;
};

export const deleteJob = async (id) => {
  const res = await api.delete(`/jobs/${id}`);
  return res.data;
};

export const updateJobStatus = async (id, statusData) => {
  const res = await api.put(`/jobs/${id}`, statusData);
  return res.data;
};

// ─── Logs ────────────────────────────────────────────────────────────────────

export const getLogs = async (params) => {
  const res = await api.get("/logs", { params });
  return res.data;
};

export const clearLogs = async () => {
  const res = await api.delete("/logs");
  return res.data;
};

// ─── Reports ─────────────────────────────────────────────────────────────────

export const getAllReports = async (params) => {
  const res = await api.get("/reports", { params });
  return res.data;
};

export const createReport = async (reportData) => {
  const res = await api.post("/reports", reportData);
  return res.data;
};

export const updateReportStatus = async (id, statusData) => {
  const res = await api.put(`/reports/${id}/status`, statusData);
  return res.data;
};

export const addReportReply = async (id, replyData) => {
  const res = await api.post(`/reports/${id}/reply`, replyData);
  return res.data;
};

export default api;
