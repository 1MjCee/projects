import axios from "axios";
import { encrypt, decrypt } from "./encryptionUtils";
import isTokenExpiringSoon from "./token_expire";

export const getTokenFromLocalStorage = (tokenType) => {
  const tokenKey = tokenType === "refresh" ? "refresh_token" : "access_token";
  const token = localStorage.getItem(tokenKey);
  return token ? decrypt(token) : null;
};

export const setTokenInLocalStorage = (token, tokenType) => {
  const encryptedToken = encrypt(token);
  const tokenKey = tokenType === "refresh" ? "refresh_token" : "access_token";
  localStorage.setItem(tokenKey, encryptedToken);
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const isPublicRoute = (url) => {
  const publicRoutes = [
    "/api/registration/register/",
    "/api/login/",
    "/api/countries/",
  ];
  return publicRoutes.some((route) => url.includes(route));
};

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    if (!isPublicRoute(config.url)) {
      const accessToken = getTokenFromLocalStorage("access");
      const refreshToken = getTokenFromLocalStorage("refresh");

      if (accessToken) {
        if (isTokenExpiringSoon(accessToken, 300)) {
          try {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
              { refresh: refreshToken }
            );
            setTokenInLocalStorage(data.access, "access");
            setTokenInLocalStorage(data.refresh, "refresh");
            config.headers["Authorization"] = `Bearer ${data.access}`;
          } catch (refreshError) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/auth/login";
            return Promise.reject(refreshError);
          }
        } else {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response, config } = error;

    if (response) {
      const { status } = response;

      // Handle token refresh for 401 errors
      if (status === 401 && !config._retry) {
        config._retry = true; // Prevents infinite retry loop

        const accessToken = getTokenFromLocalStorage("access");
        const refreshToken = getTokenFromLocalStorage("refresh");

        if (refreshToken) {
          try {
            const { data } = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`,
              { refresh: refreshToken }
            );
            setTokenInLocalStorage(data.access, "access");
            setTokenInLocalStorage(data.refresh, "refresh");
            config.headers["Authorization"] = `Bearer ${data.access}`;
            return api(config);
          } catch (refreshError) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/auth/login";
            return Promise.reject(refreshError);
          }
        } else {
          // No refresh token, log out the user
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/auth/login";
        }
      } else if (status === 403) {
        console.error("Forbidden - You don't have permission");
      } else if (status === 500) {
        console.error("Server error - Please try again later");
      } else {
        console.error("An error occurred:", status);
      }
    } else {
      console.error("Network error - Please check your connection");
    }

    return Promise.reject(error);
  }
);

export default api;
