import { Document } from '../db/mongoose';
import { IUser } from './IUser';

export interface IBreak extends Document {
  user_id: IUser['_id'];
  count: number;
  created_at: Date;
}

export interface IBreakDocument extends IBreak, Document {}
