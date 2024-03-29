import { Router } from 'express';
import {
  emitCallForHelp,
  getAdminDashboard,
  getManagementDashboard,
} from '../controllers/actions.controller';

const actionsRouter = Router();

actionsRouter
  .get('/admin-dashboard', getAdminDashboard)
  .get('/management-dashboard', getManagementDashboard)
  .post('/help', emitCallForHelp);

export default actionsRouter;
