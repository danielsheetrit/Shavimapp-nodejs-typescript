import { Request, Response } from 'express';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';
import { User } from '../models/user.model';
import { Break } from '../models/break.model';
import { mongoose } from '../db/mongoose';
import { getCurrentDate, getStartAndEndOfDate } from '../utils';

const handleBreak = async (req: Request, res: Response) => {
  const { id, isBreak } = req.body;

  try {
    await User.findByIdAndUpdate(id, { onBreak: isBreak });

    if (!isBreak) {
      socketIo.emit(eventEmiters.USER_CAME_FROM_BREAK, { userId: id });
    } else {
      socketIo.emit(eventEmiters.USER_IN_BREAK);
    }

    return res.status(200).json({});
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to get handle break', error: err.toSring() });
  }
};

const validateBreak = async (req: Request, res: Response) => {
  const { id, timezone, milli } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Failed to find User at validateBreak' });
    }

    const { start, end } = getStartAndEndOfDate(milli, timezone);

    if (user.onBreak) {
      // Find a break document for this user and today's date
      const breakRecords = await Break.aggregate([
        {
          $match: {
            user_id: new mongoose.Types.ObjectId(id),
            created_at: { $gt: start, $lt: end },
          },
        },
      ]);

      let currentBreak = breakRecords[0] || null;

      // If no document exists, create a new one
      if (!currentBreak) {
        currentBreak = new Break({
          user_id: id,
          count: 1,
          created_at: getCurrentDate(),
        });
        await currentBreak.save();
      } else {
        await Break.findOneAndUpdate(
          { _id: currentBreak._id },
          {
            count: currentBreak.count + 1,
          }
        );
      }

      socketIo.emit(eventEmiters.USER_BREAK_VALIDATED, { userId: id });
    }

    return res.json({});
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to validateBreak', error: err.toString() });
  }
};

export { handleBreak, validateBreak };
