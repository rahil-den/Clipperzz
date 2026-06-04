import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

/**
 * Submit a video URL for processing.
 */
export async function submitUrl(url) {
  const response = await api.post('/process', { url });
  return response.data;
}

/**
 * Submit a video file for processing.
 */
export async function submitFile(file) {
  const formData = new FormData();
  formData.append('video', file);
  const response = await api.post('/process', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  });
  return response.data;
}

/**
 * Get the status of a processing job.
 */
export async function getJobStatus(jobId) {
  const response = await api.get(`/status/${jobId}`);
  return response.data;
}

/**
 * Get the download URL for a clip.
 */
export function getDownloadUrl(filename) {
  return `${API_BASE}/download/${filename}`;
}
