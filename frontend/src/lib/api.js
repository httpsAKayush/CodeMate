import axios from "axios";
import { getToken } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await axios({
      url: `${API_BASE_URL}${path}`,
      method: options.method || "GET",
      data: options.data,
      headers,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Request failed"
    );
  }
};

export const authApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      data: payload,
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      data: payload,
    }),
  me: () => request("/auth/me"),
};

export const sessionApi = {
  getSession: (id) => request(`/session/${id}`),
  runCode: (id, payload) =>
    request(`/session/${id}/run`, {
      method: "POST",
      data: payload,
    }),
  submitSolution: (id, payload) =>
    request(`/session/${id}/submit`, {
      method: "POST",
      data: payload,
    }),
  getHint: (id, payload) =>
    request(`/session/${id}/hint`, {
      method: "POST",
      data: payload,
    }),
};
