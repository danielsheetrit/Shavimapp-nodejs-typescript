import { mongoose, Schema } from '../db/mongoose';
import { IEvent, IEventDocument } from '../interfaces/IEvent';

const eventSchema: Schema<IEvent> = new mongoose.Schema({
  event_list: {
    type: Map,
    of: String,
    default: new Map(),
  },
  language: {
    type: String,
    lowercase: true,
    enum: ['en', 'ru', 'he', 'ar'],
    default: 'he',
  },
});

const Event = mongoose.model<IEventDocument>('Event', eventSchema);

export { Event };
