import type { Money } from './money';

export interface EventParticipant {
  personId: string;
  personalBudget?: Money;
}

/** Event resource as represented in JSON. targetDate is YYYY-MM-DD. */
export interface Event {
  id: string;
  name: string;
  targetDate: string;
  budget?: Money;
  participants: EventParticipant[];
  createdAt: string;
  updatedAt: string;
}

/** Fields the client sends when creating an event. */
export type CreateEventDto = Pick<Event, 'name' | 'targetDate'> &
  Partial<Pick<Event, 'budget' | 'participants'>>;

/** Partial update payload; omitted fields are left unchanged. */
export type UpdateEventDto = Partial<CreateEventDto>;