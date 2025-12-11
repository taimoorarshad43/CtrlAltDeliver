/**
 * Central configuration for API endpoints
 * 
 * In production (same domain): defaults to empty string for relative URLs
 * In development: can override with VITE_API_BASE_URL=http://localhost:5000 in .env.local
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

