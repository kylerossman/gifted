import apiClient from '@/api/client';
import { API_ENDPOINTS } from '@/constants/apiConfig';
import type { Gift } from '@/types/gift';
import type { Group } from '@/types/group';
import type { Person } from '@/types/person';

import type { GiftedDataSource } from './gifted-data-source';

type DateFields = 'createdAt' | 'updatedAt';

type GroupResponse = Omit<Group, DateFields | 'eventDate'> & {
  createdAt: string;
  updatedAt: string;
  eventDate?: string;
};

type PersonResponse = Omit<Person, DateFields> & {
  createdAt: string;
  updatedAt: string;
};

type GiftResponse = Omit<Gift, DateFields> & {
  createdAt: string;
  updatedAt: string;
};

/**
 * Provisional REST contract: each endpoint is expected to return a JSON array
 * directly. Update these paths/mappers to match the Spring API when it exists.
 */
export const restGiftedDataSource: GiftedDataSource = {
  async getGroups() {
    const { data } = await apiClient.get<GroupResponse[]>(API_ENDPOINTS.groups);
    return data.map((group) => ({
      ...group,
      createdAt: new Date(group.createdAt),
      updatedAt: new Date(group.updatedAt),
      ...(group.eventDate ? { eventDate: new Date(group.eventDate) } : {}),
    }));
  },

  async getPeople() {
    const { data } = await apiClient.get<PersonResponse[]>(API_ENDPOINTS.people);
    return data.map((person) => ({
      ...person,
      createdAt: new Date(person.createdAt),
      updatedAt: new Date(person.updatedAt),
    }));
  },

  async getGifts() {
    const { data } = await apiClient.get<GiftResponse[]>(API_ENDPOINTS.gifts);
    return data.map((gift) => ({
      ...gift,
      createdAt: new Date(gift.createdAt),
      updatedAt: new Date(gift.updatedAt),
    }));
  },
};