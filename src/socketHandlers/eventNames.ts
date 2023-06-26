const DISCONNECT = 'disconnect';
const CONNECTION = 'connection';
const USER_ACTIVITY_UPDATE = 'user-activity-update';
const USER_IN_BREAK = 'user-in-break';
const USER_CAME_FROM_BREAK = 'user-came-from-break';
const CALL_FOR_HELP = 'call-for-help';
const COUNTER_INCREMENT = 'counter-increment';
const SETTINGS_UPDATED = 'settings-updated';
const EVENTS_UPDATED = 'events-updated';

export const eventListeners = {
  DISCONNECT,
  CONNECTION,
};

export const eventEmiters = {
  CALL_FOR_HELP,
  USER_ACTIVITY_UPDATE,
  USER_IN_BREAK,
  USER_CAME_FROM_BREAK,
  COUNTER_INCREMENT,
  SETTINGS_UPDATED,
  EVENTS_UPDATED,
};
