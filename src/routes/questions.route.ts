import { Router } from 'express';
import {
  answerQuestion,
  initiateQuestion,
} from '../controllers/questions.controller';

const questionRouter = Router();

questionRouter.post('/', initiateQuestion).put('/', answerQuestion);

export default questionRouter;
