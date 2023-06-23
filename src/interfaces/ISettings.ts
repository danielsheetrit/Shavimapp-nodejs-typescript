export interface ISettings {
  min_break_time: number;
  min_count_time: number;
  register_page_availble: boolean;
  call_for_help_availble: boolean;
}

export interface ISettingsDocument extends ISettings, Document {}
