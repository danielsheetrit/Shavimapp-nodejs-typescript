import { Socket } from 'socket.io';
import { connectionHandlers } from './connection.handler';
import { eventListeners } from './eventNames';
import {
  startJob,
  stopJobAfterStale,
  restartJob,
} from '../distressChecking/job';
import { distressCheck } from '../distressChecking';
import { getDistressCheckSettings } from '../controllers/utils.controller';

export async function handleConnectivity(socket: Socket) {
  await connectionHandlers.handleUserStatus(socket, true);
  startJob();

  socket.on(eventListeners.DISTRESS_SETTINGS_CHANGED, () => {
    restartJob();
  });

  socket.on(
    eventListeners.CLIENT_SENT_DISTRESS_JOB_ARGS,
    _handleClientDistressArgs
  );

  socket.on(eventListeners.DISCONNECT, async () => {
    // In case no one is connected 15 minutes shut down
    await connectionHandlers.handleUserStatus(socket, false);
    stopJobAfterStale();
  });
}

async function _handleClientDistressArgs(socket: Socket) {
  const milli = socket.data.milli;
  const offset = socket.data.offset;

  const settings = await getDistressCheckSettings();

  if (!settings) {
    throw new Error('failed to fetch settings when start a job');
  }

  const { sampling_cycle_in_minutes, count_ref_per_hour } = settings;

  distressCheck(sampling_cycle_in_minutes, count_ref_per_hour, offset, milli);
}
