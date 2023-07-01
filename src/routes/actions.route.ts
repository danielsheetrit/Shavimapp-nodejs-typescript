import { Router } from 'express';

import { emitCallForHelp } from '../controllers/actions.controller';

const actionsRouter = Router();

actionsRouter.post('/help', emitCallForHelp);

export default actionsRouter;
