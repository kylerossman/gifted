/**
 * Temporary dashboard card projection, not a backend resource.
 * Replace this with Event and Person sections during the dashboard redesign.
 */
export interface Group {
  id: string;
  name: string;
  groupType: 'person' | 'event';
  eventDate?: string;
  personName?: string;
  giftCount: number;
}
