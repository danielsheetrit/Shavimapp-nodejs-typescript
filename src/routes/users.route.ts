import { Router } from 'express';
import { upload } from '../middlewares/upload-file';

import {
  register,
  login,
  getUserSummary,
  loginEmployee,
  getUserWithToken,
  logout,
  getAllUsers,
} from '../controllers/users.controller';

const userRouter = Router();

userRouter
  .get('/', getAllUsers)
  .get('/users-summary', getUserSummary)
  .get('/user-with-token', getUserWithToken)
  .put('/logout', logout)
  .post('/login-employee', loginEmployee)
  .post('/register', upload.single('file'), register)
  .post('/login', login);

export default userRouter;
