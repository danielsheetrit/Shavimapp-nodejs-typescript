import { Request, Response } from 'express';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';
import { User } from '../models/user.model';
import { Break } from '../models/break.model';

const handleBreak = async (req: Request, res: Response) => {
  const { id, isBreak } = req.body;

  try {
    await User.findByIdAndUpdate(id, { onBreak: isBreak });

    if (!isBreak) {
      socketIo.emit(eventEmiters.USER_CAME_FROM_BREAK, { userId: id });
    } else {
      socketIo.emit(eventEmiters.USER_IN_BREAK, { userId: id });
    }

    console.log(`[Break]: ${isBreak}`);
    return res.status(200).json({});
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to get handle click', error: err });
  }
};

const validateBreak = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);

    if (user?.onBreak) {
      console.log('[Break]: Starts validating break');

      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0); // set the time to start of the day

      // Find a break document for this user and today's date
      let userBreak = await Break.findOne({ userId: id, date: todayDate });

      // If no document exists, create a new one
      if (!userBreak) {
        userBreak = new Break({ userId: id, breaks_count: 0, date: todayDate });
      }

      // Increment the break count
      userBreak.breaks_count = userBreak.breaks_count + 1;

      // Save the updated break count
      await userBreak.save();

      socketIo.emit(eventEmiters.USER_BREAK_VALIDATED, { userId: id });
    }

    return res.json({});
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to validateBreak', error: err });
  }
};

export { handleBreak, validateBreak };
