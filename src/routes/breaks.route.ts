import { Router } from 'express';
import { handleBreak, validateBreak } from '../controllers/breaks.controller';

const breaksRouter = Router();

breaksRouter.put('/update', handleBreak).put('/validate', validateBreak);

export default breaksRouter;
