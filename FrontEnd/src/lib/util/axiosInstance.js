import axios from "axios";
import { useAuth } from "@/store/AuthContext";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 🔹 401 에러 발생 시 자동 로그아웃
api.interceptors.response.use(
  (response) => response,
  (error) => {s
    if (error.response && error.response.status === 401) {
      console.warn("AccessToken이 만료됨. 자동 로그아웃 실행");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
