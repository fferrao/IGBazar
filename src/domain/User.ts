/**
 * Represents a User.
 * Attributes public for easier manipulations.
 */
export interface IUser {
  uid: string;
  displayName: string;
  email: string;
  status: string;

  usernames: {};
}
