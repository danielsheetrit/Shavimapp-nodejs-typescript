import { Router } from 'express';
import { getAllMedia } from '../controllers/media.controller';

const mediaRouter = Router();

mediaRouter.get('/', getAllMedia);

export default mediaRouter;
