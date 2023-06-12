import { Router } from 'express';
import {
  register,
  login,
  getUserSummary,
  loginEmployee,
  getUserById,
} from '../controllers/users.controller';

const userRouter = Router();

userRouter
  .get('/user-by-id/:id', getUserById)
  .get('/users-summary', getUserSummary)
  .post('/login-employee', loginEmployee)
  .post('/register', register)
  .post('/login', login);

export default userRouter;
