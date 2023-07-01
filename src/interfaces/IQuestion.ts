import { Document } from '../db/mongoose';
import { IUser } from './IUser';

export interface IQuestion extends Document {
  sender: IUser['_id'];
  receiver: IUser['_id'];
  question_type: 'text' | 'img' | 'video' | 'postcard' | 'feeling';
  createdAt: Date;
  accepted: boolean;
  url?: string;
  text?: string;
}

export interface IQuestionDocument extends IQuestion, Document {}
