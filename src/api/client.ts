import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiErrorResponse } from "@/types/api.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://nesthive-backend.vercel.app/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor: attach bearer token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("nesthive.token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle standardized backend payload & errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const errorData = error.response?.data;
    const message =
      errorData?.message ||
      (errorData?.errors && errorData.errors.length > 0 ? errorData.errors[0].message : null) ||
      error.message ||
      "An unexpected error occurred";

    const customError = new Error(message);
    (customError as unknown as Record<string, unknown>).statusCode = error.response?.status;
    (customError as unknown as Record<string, unknown>).errors = errorData?.errors;

    return Promise.reject(customError);
  },
);

export default apiClient;
