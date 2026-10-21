import type { Gift } from '@/types/gift';
import type { Group } from '@/types/group';
import type { Person } from '@/types/person';

/**
 * Frontend data contract shared by the mock and REST implementations.
 * The REST paths and response models are provisional until the Spring API is defined.
 */
export interface GiftedDataSource {
  getGroups(): Promise<Group[]>;
  getPeople(): Promise<Person[]>;
  getGifts(): Promise<Gift[]>;
}