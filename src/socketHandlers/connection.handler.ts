import { Socket } from 'socket.io';
import { socketIo } from '../server';
import { User } from '../models/user.model';
import { eventEmiters } from './eventNames';

async function handleUserStatus(socket: Socket, status: boolean) {
  console.log(`[${status ? 'connected' : 'disconnected'}]: ${socket.id}`);

  const userId = socket.handshake.auth['userId'];

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, {
      connected: status,
    });

    if (!updatedUser) {
      throw new Error('Failed to update DB at: activateUserStatus');
    }

    if (status) {
      await User.findByIdAndUpdate(userId, {
        last_login: new Date(),
      });
    }

    console.log(
      `[${status ? 'updated-connected' : 'updated-disconnected'}]: ${socket.id}`
    );
  } catch (err) {
    console.error('Failed to update user status', err.message);
  } finally {
    socketIo.emit(eventEmiters.USER_ACTIVITY_UPDATE);
  }
}

export const connectionHandlers = {
  handleUserStatus,
};
