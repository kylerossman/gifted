/**
 * Group interface for organizing gifts by person or event
 */
export interface Group {
  id: string;
  name: string;
  description?: string;
  groupType: 'person' | 'event';
  eventDate?: Date; // For event-based groups (e.g., Christmas, Birthday)
  personName?: string; // For person-based groups (e.g., significant other)
  color?: string; // Hex color for UI display
  createdAt: Date;
  updatedAt: Date;
  giftCount?: number; // Number of gifts in this group
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  groupType: 'person' | 'event';
  eventDate?: Date;
  personName?: string;
  color?: string;
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
  eventDate?: Date;
  personName?: string;
  color?: string;
}
