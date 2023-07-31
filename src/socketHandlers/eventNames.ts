const DISCONNECT = 'disconnect';
const CONNECTION = 'connection';
const USER_ACTIVITY_UPDATE = 'user-activity-update';
const USER_IN_BREAK = 'user-in-break';
const USER_BREAK_VALIDATED = 'user-break-validated';
const USER_CAME_FROM_BREAK = 'user-came-from-break';
const CALL_FOR_HELP = 'call-for-help';
const COUNTER_INCREMENT = 'counter-increment';
const SETTINGS_UPDATED = 'settings-updated';
const EVENTS_UPDATED = 'events-updated';
const DISTRESS_SETTINGS_CHANGED = 'distress-checking-changed';
const USER_IN_DISTRESS = 'user-in-distress';
const QUESTION_CREATED = 'question-created';
const QUESTION_ANSWERED = 'question-answered';
const CLIENT_SENT_DISTRESS_JOB_ARGS = 'client-sent-distress-job-args';
const NEED_DISTRESS_JOB_ARGS = 'need-distress-job-args';

export const eventListeners = {
  DISCONNECT,
  CONNECTION,
  DISTRESS_SETTINGS_CHANGED,
  CLIENT_SENT_DISTRESS_JOB_ARGS,
};

export const eventEmiters = {
  CALL_FOR_HELP,
  USER_ACTIVITY_UPDATE,
  USER_BREAK_VALIDATED,
  USER_IN_BREAK,
  USER_CAME_FROM_BREAK,
  COUNTER_INCREMENT,
  SETTINGS_UPDATED,
  EVENTS_UPDATED,
  DISTRESS_SETTINGS_CHANGED,
  USER_IN_DISTRESS,
  QUESTION_ANSWERED,
  QUESTION_CREATED,
  NEED_DISTRESS_JOB_ARGS,
};
