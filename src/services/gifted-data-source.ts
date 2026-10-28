import type { Event } from '@/types/event';
import type { GiftIdea } from '@/types/gift';
import type { Person } from '@/types/person';

/**
 * Resource contract shared by the mock and REST implementations.
 */
export interface GiftedDataSource {
  getEvents(): Promise<Event[]>;
  getPeople(): Promise<Person[]>;
  getGiftIdeas(): Promise<GiftIdea[]>;
  getPersonGiftIdeas(personId: string): Promise<GiftIdea[]>;
}