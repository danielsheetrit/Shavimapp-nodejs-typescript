import { Router } from 'express';

import { getEventByLanguage } from '../controllers/events.controller';

const eventRouter = Router();

eventRouter.get('/event-by-language/:language', getEventByLanguage);

export default eventRouter;
