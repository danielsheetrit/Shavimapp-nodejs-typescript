import { Document } from '../db/mongoose';
import { IUser } from './IUser';

export interface IBreak extends Document {
  userId: IUser['_id'];
  breaks_count: number;
  date: Date;
}

export interface IBreakDocument extends IBreak, Document {}
