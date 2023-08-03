import { Schema, mongoose } from '../db/mongoose';
import { IClick, IClickDocument } from '../interfaces/IClick';

const ClickSchema: Schema<IClick> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true, default: () => Date.now() },
    count: { type: Number, required: true },
  },
  { collection: 'clicks' }
);

const Click = mongoose.model<IClickDocument>('Click', ClickSchema);
export { Click };
