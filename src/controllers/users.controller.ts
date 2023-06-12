import 'dotenv/config';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/IUser';
import { User } from '../models/user.model';
import { isEmpty } from '../utils';

const register = async (req: Request, res: Response) => {
  const { username, first_name, last_name, user_type, password }: IUser =
    req.body;

  if (isEmpty([username, first_name, last_name, user_type, password])) {
    return res
      .status(400)
      .json({ message: 'One or more of the fields are empty' });
  }

  const validPassowrd = /^[a-zA-Z0-9]{8,}$/;
  if (!validPassowrd.test(password)) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const userExists = await User.exists({ username });

  if (userExists !== null) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPw = await bcrypt.hash(password, 8);

  try {
    const user = new User({
      username,
      first_name,
      last_name,
      user_type,
      password: hashedPw,
    });

    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to register' });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (isEmpty([username, password])) {
    return res
      .status(400)
      .json({ message: 'One or more of the fields are empty' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Username or Password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const acsessToken = jwt.sign(
      {
        _id: user.id.toString(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8h experation
      },
      process.env.JWT_SECRET as string
    );

    user.password = '';

    return res.status(200).json({ acsessToken, user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to login' });
  }
};

export { register, login };
