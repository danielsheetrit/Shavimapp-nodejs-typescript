import { Router } from 'express';
import { upload } from '../middlewares/upload-file';

import {
  register,
  login,
  getUserSummary,
  loginEmployee,
  getUserWithToken,
  logout,
  deleteUsers,
  updateUser,
} from '../controllers/users.controller';

const userRouter = Router();

userRouter
  .get('/users-summary', getUserSummary)
  .get('/user-with-token', getUserWithToken)
  .put('/logout', logout)
  .put('/delete', deleteUsers)
  .put('/update', updateUser)
  .post('/login-employee', loginEmployee)
  .post('/register', upload.single('file'), register)
  .post('/login', login);

export default userRouter;
