import { Document } from '../db/mongoose';
import { IUser } from './IUser';

export interface IQuestion extends Document {
  sender: IUser['_id'] | '';
  receiver: IUser['_id'];
  question_type: 'video' | 'postcard' | 'feeling';
  created_at: Date;
  answer: string;
  is_system: boolean;
  url?: string;
  text?: string;
}

export interface IQuestionDocument extends IQuestion, Document {}
