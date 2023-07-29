import { Document } from '../db/mongoose';

export interface IUser extends Document {
  username: string;
  first_name: string;
  last_name: string;
  user_type: 'user' | 'admin' | 'chief';
  created_at: Date;
  password: string;
  work_group: number;
  connected: boolean;
  avatar: Buffer | string;
  onBreak: boolean;
  language: 'en' | 'ru' | 'he' | 'ar';
  last_login: Date;
  need_help: boolean;
}

export interface IUserDocument extends IUser, Document {}
