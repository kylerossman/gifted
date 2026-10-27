import type { Event } from '@/types/event';
import type { GiftIdea } from '@/types/gift';
import type { Group } from '@/types/group';
import type { Person } from '@/types/person';

/**
 * Resource contract shared by the mock and REST implementations.
 * getGroups() is a temporary projection for the current dashboard, not an API resource.
 */
export interface GiftedDataSource {
  getEvents(): Promise<Event[]>;
  getGroups(): Promise<Group[]>;
  getPeople(): Promise<Person[]>;
  getGiftIdeas(): Promise<GiftIdea[]>;
}