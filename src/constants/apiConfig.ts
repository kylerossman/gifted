/**
 * API Configuration
 * Update BASE_URL to point to your Java backend API
 */

// Override these with EXPO_PUBLIC_API_BASE_URL and EXPO_PUBLIC_DATA_SOURCE.
// Local development: http://192.168.x.x:8080 (use your machine's local IP)
// Production: https://your-api-domain.com
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || 'http://localhost:8080';

// Keep the app usable before the backend is available. Set this to "rest" to
// opt into the guessed REST contract; request failures are then shown as errors.
export const DATA_SOURCE_MODE = process.env.EXPO_PUBLIC_DATA_SOURCE === 'rest' ? 'rest' : 'mock';

// API Endpoints
export const API_ENDPOINTS = {
  // Gift endpoints
  gifts: '/api/gifts',
  giftById: (id: string) => `/api/gifts/${id}`,
  
  // Group endpoints
  groups: '/api/groups',
  groupById: (id: string) => `/api/groups/${id}`,
  groupGifts: (groupId: string) => `/api/groups/${groupId}/gifts`,

  // Best-guess people endpoint; confirm when the Spring API is designed.
  people: '/api/people',
  
  // Amazon link parsing (optional - if backend provides this)
  parseAmazonLink: '/api/amazon/parse',
  
  // Auth endpoints (if needed)
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  profile: '/api/auth/profile',
};

// API timeouts
export const API_TIMEOUT = 10000; // 10 seconds

// Development/Production flags
export const IS_DEV = process.env.NODE_ENV === 'development';
