export type UserRole = 'supporter' | 'creator' | 'admin';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  photoUrl?: string;
  role: UserRole;
  credits: number;
  raisedCredits?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
