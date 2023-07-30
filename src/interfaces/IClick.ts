import { Document } from '../db/mongoose';
import { IUser } from './IUser';

export interface IClick {
  user_id: IUser['_id'];
  created_at: Date;
  updated_at: Date;
  count: number;
}

export interface IClickDocument extends IClick, Document {}
