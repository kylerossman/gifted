/**
 * Safe representation of the signed-in user's profile.
 * Credentials such as passwords must never be fields on this resource.
 */
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Optional phone number, stored as a string to preserve '+' and leading zeroes. */
  phoneNumber?: string;
  /** Remote image reference; image bytes are uploaded separately. */
  imageUrl?: string;
  /** IDs of connected UserProfile records, not the user's Person records. */
  friendIds: string[];
  createdAt: string;
  updatedAt: string;
}

/** Editable profile fields. Friend relationships are managed separately. */
export type UpdateUserProfileDto = Partial<
  Pick<UserProfile, 'firstName' | 'lastName' | 'email' | 'phoneNumber' | 'imageUrl'>
>;

/**
 * Account registration payload. The password is sent only to the registration/auth endpoint;
 * it must not be stored in app profile state, logged, or returned by the API.
 */
export type RegisterUserDto = Pick<UserProfile, 'firstName' | 'lastName' | 'email'> &
  Partial<Pick<UserProfile, 'phoneNumber' | 'imageUrl'>> & {
    password: string;
  };
