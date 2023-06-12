import { Document } from '../db/mongoose';

export interface IUser extends Document {
  username: string;
  first_name: string;
  last_name: string;
  user_type: 'user' | 'admin' | 'chief';
  created_at: Date;
  password: string;
  // work_group: 'a' | 'b' | 'c';
  language: 'en' | 'ru' | 'he' | 'ar';
  clicks: Map<string, number>;
}

export interface IUserDocument extends IUser, Document {}
