import type { Event } from '@/types/event';
import type { GiftIdea } from '@/types/gift';
import type { Person } from '@/types/person';

import type { GiftedDataSource } from './gifted-data-source';

const now = '2026-10-22T14:30:00Z';

const events: Event[] = [
  {
    id: '3f77a2fa-f293-4d6b-9855-087f969a2b15',
    name: 'Christmas 2026',
    targetDate: '2026-12-25',
    budget: { amountMinor: 50000, currency: 'USD' },
    participants: [
      {
        personId: '2e58b6d0-487a-4b2a-a6a1-543aa14c0c42',
        personalBudget: { amountMinor: 10000, currency: 'USD' },
      },
      {
        personId: 'e341baaf-c82d-41fa-97d6-1b851cf4938e',
        personalBudget: { amountMinor: 10000, currency: 'USD' },
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'a83aacdb-78a0-40b3-b8a2-bda8d2af03e9',
    name: "Mom's Birthday",
    targetDate: '2027-05-10',
    participants: [{ personId: 'e341baaf-c82d-41fa-97d6-1b851cf4938e' }],
    createdAt: now,
    updatedAt: now,
  },
];

const people: Person[] = [
  {
    id: '2e58b6d0-487a-4b2a-a6a1-543aa14c0c42',
    firstName: 'Molly',
    lastName: 'Goodykoontz',
    notes: 'Likes hiking and science fiction.',
    imageUrl: 'https://example.com/images/sarah.jpg',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'e341baaf-c82d-41fa-97d6-1b851cf4938e',
    firstName: 'Mom',
    lastName: 'Rossman',
    notes: 'Enjoys gardening.',
    createdAt: now,
    updatedAt: now,
  },
];

const giftIdeas: GiftIdea[] = [
  {
    id: '8ccaa0bc-8bbf-490d-a810-aaae26f87ff6',
    personId: '2e58b6d0-487a-4b2a-a6a1-543aa14c0c42',
    eventId: '3f77a2fa-f293-4d6b-9855-087f969a2b15',
    label: 'Warm winter scarf',
    type: 'FREE_TEXT',
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '0b0851a3-4891-4d80-9373-2763a8243f3d',
    personId: 'e341baaf-c82d-41fa-97d6-1b851cf4938e',
    eventId: '3f77a2fa-f293-4d6b-9855-087f969a2b15',
    label: 'Favorite board game',
    type: 'WEBSITE',
    url: 'https://example.com/board-game',
    price: { amountMinor: 3499, currency: 'USD' },
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'd8b6f6b9-a6ab-4673-8f4a-b5e35dc525c1',
    personId: '2e58b6d0-487a-4b2a-a6a1-543aa14c0c42',
    label: 'Concert tickets',
    type: 'FREE_TEXT',
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: '19b940d5-cb95-4522-9bf3-898a008d8be1',
    personId: 'e341baaf-c82d-41fa-97d6-1b851cf4938e',
    eventId: 'a83aacdb-78a0-40b3-b8a2-bda8d2af03e9',
    label: 'Garden tools',
    type: 'AMAZON',
    url: 'https://www.amazon.com/dp/example',
    price: { amountMinor: 4999, currency: 'USD' },
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  },
];

export const mockGiftedDataSource: GiftedDataSource = {
  async getEvents() {
    return events;
  },
  async getPeople() {
    return people;
  },
  async getGiftIdeas() {
    return giftIdeas;
  },
  async getPersonGiftIdeas(personId: string) {
    return giftIdeas.filter((giftIdea) => giftIdea.personId === personId);
  },
};