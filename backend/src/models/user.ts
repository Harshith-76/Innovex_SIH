import { ObjectId } from 'mongodb';
import type { Role } from '../rbac/permissions.js';

export interface UserDocument {
  _id?: ObjectId;
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type SafeUser = Pick<UserDocument, 'user_id' | 'name' | 'email' | 'role'>;

export function toSafeUser(user: UserDocument): SafeUser {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
