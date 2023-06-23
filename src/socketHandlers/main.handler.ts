import { Socket } from 'socket.io';
import { connectionHandlers } from './connection.handler';
import { eventListeners } from './eventNames';

export default function handleEvents(socket: Socket) {
  connectionHandlers.handleUserStatus(socket, true);

  socket.on(eventListeners.DISCONNECT, () =>
    connectionHandlers.handleUserStatus(socket, false)
  );
}
