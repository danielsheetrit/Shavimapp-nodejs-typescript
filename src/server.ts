import express, { Application, Request, Response } from 'express';
import { createHttpTerminator } from 'http-terminator';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';

import './db/mongoose';
import userRouter from './routes/users.route';
import eventRouter from './routes/events.route';

const app: Application = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3030;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/users', userRouter);
app.use('/events', eventRouter);

export const server = http.createServer(app);
export const httpTerminator = createHttpTerminator({
  server,
});

app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
