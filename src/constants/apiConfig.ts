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

// Provisional REST paths aligned with docs/api-contract-draft.md.
export const API_ENDPOINTS = {
  events: '/api/events',
  eventById: (id: string) => `/api/events/${id}`,

  people: '/api/people',
  personById: (id: string) => `/api/people/${id}`,
  personEvents: (personId: string) => `/api/people/${personId}/events`,
  personGiftIdeas: (personId: string) => `/api/people/${personId}/gift-ideas`,

  giftIdeas: '/api/gift-ideas',
  giftIdeaById: (id: string) => `/api/gift-ideas/${id}`,

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
