import { Schema, mongoose } from '../db/mongoose';
import { IClick, IClickDocument } from '../interfaces/IClick';

const ClickSchema: Schema<IClick> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clicks_dates: { type: [Date], required: true, default: [] },
    date: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
  },
  { collection: 'clicks' }
);

const Click = mongoose.model<IClickDocument>('Click', ClickSchema);
export { Click };
