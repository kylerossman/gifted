import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import type { Event } from '@/types/event';
import type { GiftIdea } from '@/types/gift';
import type { Person } from '@/types/person';

import type { GiftedDataSource } from './gifted-data-source';

/**
 * Provisional REST contract: collection endpoints return JSON arrays matching
 * the documented resource shapes. Date fields stay strings to mirror JSON.
 */
export const restGiftedDataSource: GiftedDataSource = {
  async getEvents() {
    const { data } = await apiClient.get<Event[]>(API_ENDPOINTS.events);
    return data;
  },

  async getPeople() {
    const { data } = await apiClient.get<Person[]>(API_ENDPOINTS.people);
    return data;
  },

  async getGiftIdeas() {
    const { data } = await apiClient.get<GiftIdea[]>(API_ENDPOINTS.giftIdeas);
    return data;
  },

  async getPersonGiftIdeas(personId: string) {
    const { data } = await apiClient.get<GiftIdea[]>(API_ENDPOINTS.personGiftIdeas(personId));
    return data;
  },
};