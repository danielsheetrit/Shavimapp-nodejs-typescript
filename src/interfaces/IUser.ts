import { Document } from '../db/mongoose';

export type Click = {
  updatedAt: Date;
  count: number;
};
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
  clicks: Map<string, Click>;
  breaks: Map<string, number>;
}

export interface IUserDocument extends IUser, Document {}
