import { Document } from '../db/mongoose';

export interface IUser extends Document {
  username: string;
  first_name: string;
  last_name: string;
  user_type: 'user' | 'admin' | 'chief';
  created_at?: Date;
  password: string;
}

export interface IUserDocument extends IUser, Document {}
