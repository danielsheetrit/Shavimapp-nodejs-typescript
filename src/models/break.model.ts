import { Schema, mongoose } from '../db/mongoose';
import { IBreak, IBreakDocument } from '../interfaces/IBreak';

const BreakSchema: Schema<IBreak> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    breaks_count: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { collection: 'breaks' }
);

const Break = mongoose.model<IBreakDocument>('Break', BreakSchema);
export { Break };
