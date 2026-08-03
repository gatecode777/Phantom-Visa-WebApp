/// <reference types="vite/client" />

// API Configuration helper reading VITE_API_BASE_URL from environment variables
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000";

export const API_V1_URL = `${API_BASE_URL}/api/v1`;
