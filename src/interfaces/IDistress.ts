import { Document } from '../db/mongoose';
import { IUser } from './IUser';

export interface IDistress extends Document {
  userId: IUser['_id'];
  distress_count: number;
  prev_distress_count: number;
  prev_clicks_sample: number;
  date: Date;
}

export interface IDistressDocument extends IDistress, Document {}
