import type { Gift } from '@/types/gift';
import type { Group } from '@/types/group';
import type { Person } from '@/types/person';

import type { GiftedDataSource } from './gifted-data-source';

const now = new Date();

const groups: Group[] = [
  {
    id: 'group-christmas-2026',
    name: 'Christmas 2026',
    groupType: 'event',
    eventDate: new Date('2026-12-25T00:00:00'),
    createdAt: now,
    updatedAt: now,
    giftCount: 2,
  },
  {
    id: 'group-sarah',
    name: 'Sarah',
    groupType: 'person',
    personName: 'Sarah',
    createdAt: now,
    updatedAt: now,
    giftCount: 1,
  },
  {
    id: 'group-mom-birthday',
    name: "Mom's Birthday",
    groupType: 'event',
    eventDate: new Date('2027-05-10T00:00:00'),
    createdAt: now,
    updatedAt: now,
    giftCount: 1,
  },
];

const people: Person[] = [
  { id: 'person-sarah', name: 'Sarah', createdAt: now, updatedAt: now },
  { id: 'person-mom', name: 'Mom', createdAt: now, updatedAt: now },
];

const gifts: Gift[] = [
  {
    id: 'gift-1',
    title: 'Warm winter scarf',
    groupId: 'group-christmas-2026',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'gift-2',
    title: 'Favorite board game',
    groupId: 'group-christmas-2026',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'gift-3',
    title: 'Concert tickets',
    groupId: 'group-sarah',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'gift-4',
    title: 'Garden tools',
    groupId: 'group-mom-birthday',
    createdAt: now,
    updatedAt: now,
  },
];

export const mockGiftedDataSource: GiftedDataSource = {
  async getGroups() {
    return groups;
  },
  async getPeople() {
    return people;
  },
  async getGifts() {
    return gifts;
  },
};