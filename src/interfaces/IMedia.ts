import { Document } from '../db/mongoose';

export interface IMedia {
  url: string;
  name: string;
  type: 'img' | 'video';
  writer: string;
}

export interface IMediaDocument extends IMedia, Document {}
