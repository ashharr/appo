// Public routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ABOUT: '/about',
  CONTACT: '/contact',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

// App Admin routes
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  BUSINESS_CENTERS: '/admin/business-centers',
  BUSINESS_CENTER_DETAIL: (id: string) => `/admin/business-centers/${id}`,
  BUSINESS_CENTER_APPROVAL: '/admin/business-centers/approval',
  ANALYTICS: '/admin/analytics',
  SETTINGS: '/admin/settings',
  PROFILE: '/admin/profile',
} as const;

// Business Admin routes
export const BUSINESS_ADMIN_ROUTES = {
  DASHBOARD: '/business-admin/dashboard',
  STAFF: '/business-admin/staff',
  STAFF_CREATE: '/business-admin/staff/create',
  STAFF_EDIT: (id: string) => `/business-admin/staff/${id}/edit`,
  SERVICES: '/business-admin/services',
  SERVICE_CREATE: '/business-admin/services/create',
  SERVICE_EDIT: (id: string) => `/business-admin/services/${id}/edit`,
  APPOINTMENTS: '/business-admin/appointments',
  APPOINTMENT_DETAIL: (id: string) => `/business-admin/appointments/${id}`,
  PROFILE: '/business-admin/profile',
  SETTINGS: '/business-admin/settings',
} as const;

// Business Center Staff routes
export const BUSINESS_CENTER_ROUTES = {
  DASHBOARD: '/business/dashboard',
  SCHEDULE: '/business/schedule',
  APPOINTMENTS: '/business/appointments',
  APPOINTMENT_DETAIL: (id: string) => `/business/appointments/${id}`,
  SERVICES: '/business/services',
  CUSTOMERS: '/business/customers',
  CUSTOMER_DETAIL: (id: string) => `/business/customers/${id}`,
  PROFILE: '/business/profile',
} as const;

// Customer routes
export const CUSTOMER_ROUTES = {
  DASHBOARD: '/customer/dashboard',
  DISCOVER: '/customer/discover',
  BUSINESS_CENTER_DETAIL: (id: string) => `/customer/business-centers/${id}`,
  SERVICE_DETAIL: (id: string) => `/customer/services/${id}`,
  BOOK_APPOINTMENT: '/customer/book',
  APPOINTMENTS: '/customer/appointments',
  APPOINTMENT_DETAIL: (id: string) => `/customer/appointments/${id}`,
  HISTORY: '/customer/history',
  PROFILE: '/customer/profile',
  FAVORITES: '/customer/favorites',
} as const;

// Special routes
export const SPECIAL_ROUTES = {
  UNAUTHORIZED: '/unauthorized',
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
  MAINTENANCE: '/maintenance',
} as const;

// All routes combined for easy access
export const ALL_ROUTES = {
  ...PUBLIC_ROUTES,
  ...ADMIN_ROUTES,
  ...BUSINESS_ADMIN_ROUTES,
  ...BUSINESS_CENTER_ROUTES,
  ...CUSTOMER_ROUTES,
  ...SPECIAL_ROUTES,
} as const;

// Route groups for navigation
export const ROUTE_GROUPS = {
  PUBLIC: Object.values(PUBLIC_ROUTES),
  ADMIN: Object.values(ADMIN_ROUTES),
  BUSINESS_ADMIN: Object.values(BUSINESS_ADMIN_ROUTES),
  BUSINESS_CENTER: Object.values(BUSINESS_CENTER_ROUTES),
  CUSTOMER: Object.values(CUSTOMER_ROUTES),
} as const; 