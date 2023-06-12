import { Router } from 'express';
import { register, login } from '../controllers/users.controller';

const userRouter = Router();

userRouter.post('/register', register).post('/login', login);

export default userRouter;
