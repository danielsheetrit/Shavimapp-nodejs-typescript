import { Router } from 'express';
import { getClick, handleClick } from '../controllers/clicks.controller';

const clicksRouter = Router();

clicksRouter.get('/:id', getClick).put('/', handleClick);

export default clicksRouter;
