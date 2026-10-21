/**
 * Best-guess frontend model for a person managed by the backend.
 * Adjust this shape when the Spring API contract is established.
 */
export interface Person {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}