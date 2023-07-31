import { Document } from '../db/mongoose';
import { IUser } from './IUser';

export interface IDistress extends Document {
  user_id: IUser['_id'];
  distress_count: number;
  prev_distress_count: number;
  prev_clicks_sample: number;
  created_at: Date;
}

export interface IDistressDocument extends IDistress, Document {}
