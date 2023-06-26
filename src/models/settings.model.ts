import { mongoose, Schema } from '../db/mongoose';
import { ISettings, ISettingsDocument } from '../interfaces/ISettings';

const settingsSchema: Schema<ISettings> = new mongoose.Schema(
  {
    min_break_time: {
      type: Number,
      default: 1,
    },
    min_count_time: {
      type: Number,
      default: 1,
    },
    register_page_availble: {
      type: Boolean,
      default: true,
    },
    call_for_help_availble: {
      type: Boolean,
      default: true,
    },
    count_ref_per_hour: {
      type: Number,
      default: 1,
    },
    sampling_cycle_in_minutes: {
      type: Number,
      enum: [10, 20, 30, 40, 50, 60],
      default: 10,
    },
  },
  { collection: 'settings' }
);

// Setting in singular because mongoose make it plural.
const Settings = mongoose.model<ISettingsDocument>('Setting', settingsSchema);

export { Settings };
