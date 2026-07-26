export type UserRole = 'supporter' | 'creator' | 'admin';

export interface IUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password?: string;
  photoUrl?: string;
  avatar?: string;
  role: UserRole;
  credits: number;
  creditBalance: number;
  raisedCredits?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
