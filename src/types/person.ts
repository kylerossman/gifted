/** Person resource as represented in JSON. Timestamps remain ISO strings. */
export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Fields the client sends when creating a person. */
export type CreatePersonDto = Pick<Person, 'firstName' | 'lastName'> &
  Partial<Pick<Person, 'notes' | 'imageUrl'>>;

/** Partial update payload; omitted fields are left unchanged. */
export type UpdatePersonDto = Partial<CreatePersonDto>;