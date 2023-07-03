import { Schema, mongoose } from '../db/mongoose';
import { IMedia, IMediaDocument } from '../interfaces/IMedia';

const mediaSchema: Schema<IMedia> = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['img', 'video'],
      required: true,
    },
    writer: {
      type: String,
    },
  },
  { collection: 'media' }
);

const Media = mongoose.model<IMediaDocument>('media', mediaSchema);

export { Media };
