import { Router } from 'express';

import {
  getEventByLanguage,
  getEvents,
  updateEventsByLanguage,
} from '../controllers/events.controller';

const eventRouter = Router();

eventRouter
  .get('/', getEvents)
  .get('/event-by-language/:language', getEventByLanguage)
  .put('/', updateEventsByLanguage);

export default eventRouter;
