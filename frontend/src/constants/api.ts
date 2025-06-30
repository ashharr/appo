// Base API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

// Business Center endpoints
export const BUSINESS_CENTER_ENDPOINTS = {
  LIST: '/business-centers',
  CREATE: '/business-centers',
  DETAIL: (id: string) => `/business-centers/${id}`,
  UPDATE: (id: string) => `/business-centers/${id}`,
  DELETE: (id: string) => `/business-centers/${id}`,
  APPROVE: (id: string) => `/business-centers/${id}/approve`,
  REJECT: (id: string) => `/business-centers/${id}/reject`,
  STAFF: (id: string) => `/business-centers/${id}/staff`,
  SERVICES: (id: string) => `/business-centers/${id}/services`,
} as const;

// Appointment endpoints
export const APPOINTMENT_ENDPOINTS = {
  LIST: '/appointments',
  CREATE: '/appointments',
  DETAIL: (id: string) => `/appointments/${id}`,
  UPDATE: (id: string) => `/appointments/${id}`,
  DELETE: (id: string) => `/appointments/${id}`,
  CANCEL: (id: string) => `/appointments/${id}/cancel`,
  CONFIRM: (id: string) => `/appointments/${id}/confirm`,
  COMPLETE: (id: string) => `/appointments/${id}/complete`,
  ATTACHMENTS: (id: string) => `/appointments/${id}/attachments`,
} as const;

// Service endpoints
export const SERVICE_ENDPOINTS = {
  LIST: '/services',
  CREATE: '/services',
  DETAIL: (id: string) => `/services/${id}`,
  UPDATE: (id: string) => `/services/${id}`,
  DELETE: (id: string) => `/services/${id}`,
  CATEGORIES: '/services/categories',
  AVAILABILITY: (id: string) => `/services/${id}/availability`,
} as const;

// User management endpoints
export const USER_ENDPOINTS = {
  LIST: '/users',
  CREATE: '/users',
  DETAIL: (id: string) => `/users/${id}`,
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
  ACTIVATE: (id: string) => `/users/${id}/activate`,
  DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Request headers
export const REQUEST_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
} as const;

// API response status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
} as const; 