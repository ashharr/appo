// User roles in the system
export type UserRole = 'app-admin' | 'businesscenter-admin' | 'businesscenter' | 'customer';

// Authentication-related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  businessCenterId?: string; // For business center admins and staff
}

export interface LoginCredentials {
  email: string;
  password: string;
  userType: UserRole;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: UserRole;
  businessInfo?: BusinessRegistrationInfo;
}

export interface BusinessRegistrationInfo {
  name: string;
  description: string;
  address: Address;
  contact: ContactInfo;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  website?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
} 