import type { Money } from './money';

export type GiftIdeaType = 'WEBSITE' | 'AMAZON' | 'FREE_TEXT';
export type GiftIdeaStatus = 'ACTIVE' | 'BOUGHT' | 'ARCHIVED';

/** Gift idea resource as represented in JSON, including ISO date strings. */
export interface GiftIdea {
  id: string;
  personId: string;
  eventId?: string;
  label: string;
  type: GiftIdeaType;
  description?: string;
  url?: string;
  imageUrl?: string;
  price?: Money;
  status: GiftIdeaStatus;
  createdAt: string;
  updatedAt: string;
}

/** Fields the client sends when creating a gift idea; the server assigns identity/timestamps. */
export type CreateGiftIdeaDto = Omit<GiftIdea, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: GiftIdeaStatus;
};

/** Partial update payload; omitted fields are left unchanged. */
export type UpdateGiftIdeaDto = Partial<CreateGiftIdeaDto>;

/** @deprecated Use GiftIdea; retained temporarily for callers being migrated. */
export type Gift = GiftIdea;
/** @deprecated Use CreateGiftIdeaDto. */
export type CreateGiftDto = CreateGiftIdeaDto;
/** @deprecated Use UpdateGiftIdeaDto. */
export type UpdateGiftDto = UpdateGiftIdeaDto;
