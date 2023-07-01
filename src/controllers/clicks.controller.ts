import { Request, Response } from 'express';

// locals
import { User } from '../models/user.model';
import { Click } from '../models/click.model';
import { Settings } from '../models/settings.model';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';

const getClick = async (req: Request, res: Response) => {
  const { id } = req.params;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  try {
    const clickRecord = await Click.findOne({ userId: id, date: todayDate });
    res.json({ count: clickRecord?.clicks_dates.length });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to handle click', error: err });
  }
};

const handleClick = async (req: Request, res: Response) => {
  const { id } = req.body;

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  try {
    const user = await User.findById(id);

    if (user?.onBreak) {
      return res.status(403).json({ message: 'User on break cannot count' });
    }

    // Get the click record for the current date
    const clickRecord = await Click.findOne({ userId: id, date: todayDate });

    // Check if X minutes have passed since the last click
    const settings = await Settings.findOne({});

    if (!settings) {
      return res
        .status(404)
        .json({ message: 'Settings not found at handleClick' });
    }

    const timeSinceLastClick =
      Date.now() - new Date(clickRecord?.updatedAt || 0).getTime();

    const timeDidntPassed =
      timeSinceLastClick < settings?.min_count_time * (60 * 1000);

    if (timeDidntPassed) {
      return res.status(403).json({
        message: `Less than ${settings?.min_count_time} minutes since last click`,
      });
    }

    // Increment the value in the click record or create a new record if it doesn't exist
    if (clickRecord) {
      clickRecord.clicks_dates.push(new Date());
      clickRecord.updatedAt = new Date();
      await clickRecord.save();
    } else {
      const newClick = new Click({
        userId: id,
        clicks_dates: [new Date()],
        date: todayDate,
        updatedAt: new Date(),
      });
      await newClick.save();
    }

    const newCount = clickRecord ? clickRecord.clicks_dates.length : 1;

    socketIo.emit(eventEmiters.COUNTER_INCREMENT);
    return res.json({ count: newCount });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to handle click', error: err });
  }
};

export { handleClick, getClick };
