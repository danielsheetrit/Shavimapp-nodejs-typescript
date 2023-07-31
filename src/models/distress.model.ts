import { Schema, mongoose } from '../db/mongoose';
import { IDistress, IDistressDocument } from '../interfaces/IDistress';

const DistressSchema: Schema<IDistress> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    distress_count: { type: Number, required: true, default: 0 },
    prev_distress_count: { type: Number, required: true, default: 0 },
    prev_clicks_sample: { type: Number, required: true, default: 0 },
    created_at: { type: Date, required: true, default: () => Date.now() },
  },
  { collection: 'distresses' }
);

const Distress = mongoose.model<IDistressDocument>('Distress', DistressSchema);
export { Distress };
