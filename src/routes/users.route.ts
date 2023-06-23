import { Router } from 'express';
import { upload } from '../middlewares/upload-file';

import {
  register,
  login,
  getUserSummary,
  loginEmployee,
  getUserWithToken,
  handleClick,
  logout,
  handleBreak,
} from '../controllers/users.controller';

const userRouter = Router();

userRouter
  .get('/users-summary', getUserSummary)
  .get('/user-with-token', getUserWithToken)
  .put('/break', handleBreak)
  .put('/logout', logout)
  .put('/click', handleClick)
  .post('/login-employee', loginEmployee)
  .post('/register', upload.single('file'), register)
  .post('/login', login);

export default userRouter;
