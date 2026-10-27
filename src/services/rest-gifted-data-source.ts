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

  async getGroups() {
    const [events, people, giftIdeas] = await Promise.all([
      this.getEvents(),
      this.getPeople(),
      this.getGiftIdeas(),
    ]);

    return [
      ...events.map((event) => ({
        id: event.id,
        name: event.name,
        groupType: 'event' as const,
        eventDate: event.targetDate,
        giftCount: giftIdeas.filter((gift) => gift.eventId === event.id).length,
      })),
      ...people.map((person) => ({
        id: person.id,
        name: `${person.firstName} ${person.lastName}`,
        groupType: 'person' as const,
        personName: person.firstName,
        giftCount: giftIdeas.filter((gift) => gift.personId === person.id).length,
      })),
    ];
  },

  async getPeople() {
    const { data } = await apiClient.get<Person[]>(API_ENDPOINTS.people);
    return data;
  },

  async getGiftIdeas() {
    const { data } = await apiClient.get<GiftIdea[]>(API_ENDPOINTS.giftIdeas);
    return data;
  },
};