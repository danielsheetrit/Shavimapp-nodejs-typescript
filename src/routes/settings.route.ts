import { Router } from 'express';
import {
  getSettings,
  updateSettings,
} from '../controllers/settings.controller';

const settingsRouter = Router();

settingsRouter.get('/', getSettings).put('/', updateSettings);

export default settingsRouter;
