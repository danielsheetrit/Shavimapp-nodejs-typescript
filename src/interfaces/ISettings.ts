import { Document } from '../db/mongoose';
export interface ISettings {
  min_break_time: number;
  min_count_time: number;
  register_page_availble: boolean;
  call_for_help_availble: boolean;
  count_ref_per_hour: number;
  sampling_cycle_in_minutes: number;
}

export interface ISettingsDocument extends ISettings, Document {}
