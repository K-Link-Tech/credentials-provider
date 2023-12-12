import { REFRESH_ACCESS_URL } from "@/utils/constants";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000"
})

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    // console.log("Access Token", accessToken);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken} ${refreshToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          return;
        }
        const response = await api.get(REFRESH_ACCESS_URL);
        const { accessSigningPayload } = response.data;

        localStorage.setItem('accessToken', accessSigningPayload);

        // Retry the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${accessSigningPayload} ${refreshToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token error or redirect to login
        localStorage.clear();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default api;