 /**
 * Gift interface representing a gift idea
 */
export interface Gift {
  id: string;
  title: string;
  description?: string;
  price?: number;
  amazonLink?: string;
  amazonData?: {
    title?: string;
    price?: number;
    image?: string;
  };
  groupId: string;
  createdAt: Date;
  updatedAt: Date;
  status?: 'active' | 'purchased' | 'archived';
}

export interface CreateGiftDto {
  title: string;
  description?: string;
  price?: number;
  amazonLink?: string;
  groupId: string;
}

export interface UpdateGiftDto {
  title?: string;
  description?: string;
  price?: number;
  amazonLink?: string;
  status?: 'active' | 'purchased' | 'archived';
}
