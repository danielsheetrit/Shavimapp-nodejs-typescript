import 'dotenv/config';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { mongoose } from '../db/mongoose';
import { IUser } from '../interfaces/IUser';
import { User } from '../models/user.model';
import { isEmpty } from '../utils';

const register = async (req: Request, res: Response) => {
  const {
    username,
    first_name,
    last_name,
    user_type,
    password,
    language, // default to hebrew (he)
  }: IUser = req.body;

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
      language: language ? language.toLowerCase() : 'he',
    });

    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to register', error: err });
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

    return res.json({ acsessToken, user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to login', error: err });
  }
};

const loginEmployee = async (req: Request, res: Response) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username, user_type: 'user' });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Username or Password' });
    }

    const acsessToken = jwt.sign(
      {
        _id: user.id.toString(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8h experation
      },
      process.env.JWT_SECRET as string
    );

    user.password = '';
    return res.status(200).json({ user, acsessToken });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to login employee' });
  }
};

const getUserSummary = async (req: Request, res: Response) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          user_type: {
            $eq: 'user',
          },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
        },
      },
    ]);
    res.json({ users });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to get users summary', error: err });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $project: {
          password: 0,
          created_at: 0,
        },
      },
    ]);

    res.json({ user });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to get user by id', error: err });
  }
};

export { register, login, getUserSummary, loginEmployee, getUserById };
