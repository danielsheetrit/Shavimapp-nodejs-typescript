import { Document } from '../db/mongoose';

export interface IEvent extends Document {
  language: 'en' | 'ru' | 'he' | 'ar';
  event_list: Map<string, string>;
}

export interface IEventDocument extends IEvent, Document {}
