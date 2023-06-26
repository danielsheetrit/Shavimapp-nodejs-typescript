import express, { Application, Request, Response } from 'express';
import { createHttpTerminator } from 'http-terminator';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

// dev
import 'dotenv/config';

import './db/mongoose';
import userRouter from './routes/users.route';
import eventRouter from './routes/events.route';
import actionsRouter from './routes/actions.route';
import settingsRouter from './routes/settings.route';

// socket handlers
import handleEvents from './socketHandlers/main.handler';
import { eventListeners } from './socketHandlers/eventNames';

const app: Application = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/actions', actionsRouter);
app.use('/settings', settingsRouter);

export const server = http.createServer(app);
export const httpTerminator = createHttpTerminator({
  server,
});

// sockets
export const socketIo = new Server(server, {
  cors: {
    origin: '*',
  },
});

// events
socketIo.on(eventListeners.CONNECTION, handleEvents);

app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
