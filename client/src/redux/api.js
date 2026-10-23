import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Select the correct token based on the API route.
api.interceptors.request.use(
  (config) => {
    const isAdminRequest = config.url?.split("?")[0].startsWith("/admin");

    const tokenKey = isAdminRequest ? "adminToken" : "bioToken";
    const token = localStorage.getItem(tokenKey);

    config.headers = config.headers || {};

    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;

    if (isFormData) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
