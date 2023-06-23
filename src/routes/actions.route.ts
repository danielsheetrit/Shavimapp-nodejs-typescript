import { Router } from 'express';

import {
  emitCallForHelp,
  validateBreak,
} from '../controllers/actions.controller';

const actionsRouter = Router();

actionsRouter
  .post('/help', emitCallForHelp)
  .put('/validate-break', validateBreak);

export default actionsRouter;
