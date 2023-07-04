import { Router } from 'express';

import {
  emitCallForHelp,
  getAdminDashboard,
} from '../controllers/actions.controller';

const actionsRouter = Router();

actionsRouter
  .get('/admin-dashboard', getAdminDashboard)
  .post('/help', emitCallForHelp);

export default actionsRouter;
