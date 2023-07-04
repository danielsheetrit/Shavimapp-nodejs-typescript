import { Request, Response } from 'express';
import { createQuestion } from './utils.controller';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';
import { User } from '../models/user.model';
import { Question } from '../models/question.model';

const initiateQuestion = async (req: Request, res: Response) => {
  const { isSystem, sender, receiver, question_type, url, text } = req.body;

  const user = await User.findById(receiver);

  try {
    if (!user?.connected) {
      throw new Error('Cannot send Question when user not connected');
    }

    if (user?.onBreak) {
      throw new Error('Cannot send Question when user on break');
    }

    const question = await createQuestion({
      isSystem,
      sender,
      receiver,
      question_type,
      url,
      text,
    });

    socketIo.emit(eventEmiters.QUESTION_CREATED, { question });

    return res.json(question);
  } catch (err) {
    return res.status(500).json({
      message: err.message || 'Failed to initiateQuestion',
      error: err,
    });
  }
};

const answerQuestion = async (req: Request, res: Response) => {
  const { answer, id } = req.body;

  try {
    await Question.findByIdAndUpdate(
      { _id: id },
      {
        answer,
      }
    );

    socketIo.emit(eventEmiters.QUESTION_ANSWERED);
    res.json({});
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to answerQuestion', error: err });
  }
};

export { initiateQuestion, answerQuestion };
