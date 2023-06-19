import 'dotenv/config';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';

import { mongoose } from '../db/mongoose';
import { IUser } from '../interfaces/IUser';
import { User } from '../models/user.model';
import { isEmpty } from '../utils';

interface TokenPayload {
  _id: string;
}

const register = async (req: Request, res: Response) => {
  console.log('req.body', req.body);
  const {
    username,
    first_name,
    last_name,
    user_type,
    password,
    work_group, // default to hebrew (he)
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
    const buffer = await sharp(req?.file?.buffer)
      .resize({ width: 500, height: 500 })
      .png()
      .toBuffer();

    const user = new User({
      username,
      first_name,
      last_name,
      user_type,
      password: hashedPw,
      work_group,
      avatar: buffer,
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
    console.error('One or more of the fields are empty');
    return res
      .status(400)
      .json({ message: 'One or more of the fields are empty' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      console.error('Invalid Username');
      return res.status(400).json({ message: 'Invalid Username or Password' });
    }

    const connectedUser = await User.findOne({ connected: true });

    // user connected is true and forigen user wants to connect
    if (connectedUser && connectedUser?.username !== username) {
      return res.status(403).json({
        message: `Unfortunately we can’t log you in, there is a user ${connectedUser?.username} already
        logged in to the system.`,
      });
    }

    if (user.user_type === 'user') {
      return res.status(400).json({ message: 'Invalid User type' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.error('Invalid Password');
      return res.status(401).json({ message: 'Invalid Username or Password' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { connected: true },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .send({ message: 'Failed to update user connected status' });
    }

    const accessToken = jwt.sign(
      {
        _id: user.id.toString(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8h experation
      },
      process.env.JWT_SECRET as string
    );

    user.password = '';

    res.json({ accessToken, user });
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

    if (user.connected) {
      return res
        .status(403)
        .json({ message: 'You are already connected from another device' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { connected: true },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .send({ message: 'Failed to update user connected status' });
    }

    const accessToken = jwt.sign(
      {
        _id: user.id.toString(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8, // 8h experation
      },
      process.env.JWT_SECRET as string
    );

    user.password = '';

    res.json({ user, accessToken });
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
          work_group: 1,
          avatar: 1,
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

const getUserWithToken = async (req: Request, res: Response) => {
  const headerValue: string | undefined = req.header('Authorization');

  if (!headerValue) {
    return res.status(400).json({ message: 'Authorization Header missing' });
  }

  const token = headerValue.replace('Bearer ', '');

  try {
    const { _id: id } = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

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

const handleClick = async (req: Request, res: Response) => {
  const { id } = req.body;

  const currentDate = new Date();
  const formattedDate =
    ('0' + (currentDate.getMonth() + 1)).slice(-2) +
    ('0' + currentDate.getDate()).slice(-2) +
    currentDate.getFullYear();

  try {
    // Increment the value in the map or set it to 1 if it doesn't exist yet
    const result = await User.findByIdAndUpdate(
      id,
      { $inc: { ['clicks.' + formattedDate]: 1 } },
      { new: true, upsert: true }
    );

    res.json({ date: result });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to get handle click', error: err });
  }
};

const logout = async (req: Request, res: Response) => {
  const headerValue: string | undefined = req.header('Authorization');

  if (!headerValue) {
    return res.status(400).json({ message: 'Authorization Header missing' });
  }

  const token = headerValue.replace('Bearer ', '');
  try {
    const { _id } = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;

    const user = await User.findByIdAndUpdate(
      _id,
      { connected: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ message: 'No user found with this id' });
    }

    return res.status(200).send({
      message: 'User status successfully updated to disconnected',
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).send({
        message: 'An error occurred while updating the user connected status',
        error: err.message,
      });
    }
  }
};

export {
  register,
  login,
  getUserSummary,
  loginEmployee,
  getUserWithToken,
  handleClick,
  logout,
};
