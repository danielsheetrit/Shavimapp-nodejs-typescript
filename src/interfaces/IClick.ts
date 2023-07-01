import { Document } from '../db/mongoose';
import { IUser } from './IUser';

export interface IClick {
  userId: IUser['_id'];
  clicks_dates: Date[];
  date: Date;
  updatedAt: Date;
}

export interface IClickDocument extends IClick, Document {}
