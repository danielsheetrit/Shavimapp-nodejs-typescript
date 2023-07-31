import { Schema, mongoose } from '../db/mongoose';
import { IBreak, IBreakDocument } from '../interfaces/IBreak';

const BreakSchema: Schema<IBreak> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    count: { type: Number, required: true },
    created_at: { type: Date, required: true },
  },
  { collection: 'breaks' }
);

const Break = mongoose.model<IBreakDocument>('Break', BreakSchema);
export { Break };
