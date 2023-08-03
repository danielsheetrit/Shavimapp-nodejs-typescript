import { Router } from 'express';
import { getClicks, handleClick } from '../controllers/clicks.controller';

const clicksRouter = Router();

clicksRouter.get('/', getClicks).put('/', handleClick);

export default clicksRouter;
