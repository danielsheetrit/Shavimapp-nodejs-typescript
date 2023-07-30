import { Request, Response } from 'express';
import { mongoose } from '../db/mongoose';
import moment from 'moment-timezone';

// locals
import { User } from '../models/user.model';
import { Click } from '../models/click.model';
import { Settings } from '../models/settings.model';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';
import { getCurrentDate, getStartAndEndOfDate } from '../utils';

const getClicks = async (req: Request, res: Response) => {
  const { id, offset, milli } = req.params;

  const parsedOffset = parseInt(offset, 10);
  const { start, end } = getStartAndEndOfDate(milli, parsedOffset);

  try {
    const clickRecords = await Click.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(id),
          created_at: { $gt: start, $lt: end },
        },
      },
    ]);

    const currentClick = clickRecords[0] || null;

    if (!currentClick) {
      return res.status(404).json({ message: 'Failed to find click' });
    }

    return res.json({ count: currentClick.count });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to handle click', error: err });
  }
};

const handleClick = async (req: Request, res: Response) => {
  const { id: userId, offset, milli } = req.body;
  const { start, end } = getStartAndEndOfDate(milli, offset);

  try {
    // validate break
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found in  handleClick' });
    }

    if (user.onBreak) {
      return res.status(403).json({ message: 'User on break cannot count' });
    }

    // Get the click record for the current date
    const clickRecords = await Click.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          created_at: { $gt: start, $lt: end },
        },
      },
    ]);

    const currentClick = clickRecords[0] || null;

    if (currentClick) {
      // Check if X minutes have passed since the last click
      const settings = await Settings.findOne({});
      if (!settings) {
        return res
          .status(404)
          .json({ message: 'Settings not found at handleClick' });
      }

      const timeSinceLastClick =
        Date.now() - new Date(currentClick?.updated_at || 0).getTime();

      const timeDidntPassed =
        timeSinceLastClick < settings?.min_count_time * (60 * 1000);

      if (timeDidntPassed) {
        return res.status(403).json({
          message: `Less than ${settings?.min_count_time} minutes since last click`,
        });
      }
    }

    // Increment the value in the click record or create a new record if it doesn't exist
    const currentDate = getCurrentDate();
    if (currentClick) {
      await Click.findOneAndUpdate(
        { _id: currentClick._id },
        {
          count: currentClick.count + 1,
          updated_at: currentDate,
        }
      );
    } else {
      const newClick = new Click({
        user_id: userId,
        count: 1,
        created_at: currentDate,
        updated_at: currentDate,
      });
      await newClick.save();
    }

    const newCount = currentClick ? currentClick.count + 1 : 1;

    socketIo.emit(eventEmiters.COUNTER_INCREMENT);
    return res.json({ count: newCount });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to handle click', error: err });
  }
};

export { handleClick, getClicks };
