import { Socket } from 'socket.io';
import { connectionHandlers } from './connection.handler';
import { eventListeners } from './eventNames';
import {
  startJob,
  stopJobAfterStale,
  restartJob,
} from '../distressChecking/job';

export default async function handleEvents(socket: Socket) {
  await connectionHandlers.handleUserStatus(socket, true);
  // startJob();

  socket.on(eventListeners.DISTRESS_SETTINGS_CHANGED, () => {
    restartJob();
  });

  socket.on(eventListeners.DISCONNECT, async () => {
    // In case no one is connected 15 minutes shut down
    await connectionHandlers.handleUserStatus(socket, false);
    stopJobAfterStale();
  });
}
