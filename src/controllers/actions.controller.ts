import { Request, Response } from 'express';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';
import { User } from '../models/user.model';
import { todayFormattedDate } from '../utils';

const emitCallForHelp = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  try {
    socketIo.emit(eventEmiters.CALL_FOR_HELP, { userId: id, name });
    console.log(`[CALLED-FOR-HELP]: Name: ${name} | ID: ${id}`);
    return res.json({});
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to emitCallForHelp', error: err });
  }
};

const validateBreak = async (req: Request, res: Response) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);

    if (user?.onBreak) {
      console.log('[Break]: Starts validating break');
      // Check if "todayDate" key exists in the breaks map
      const todayDate = todayFormattedDate();
      const breakCount = user.breaks.get(todayDate) || 0;

      // Increment the "todayDate" count or set it to 1 if it does not exist
      await User.findOneAndUpdate(
        { _id: id },
        { $set: { ['breaks.' + todayDate]: breakCount + 1 } }
      );

      socketIo.emit(eventEmiters.USER_IN_BREAK, { userId: id });
      return res.json({});
    }

    return res.json({});
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to validateBreak', error: err });
  }
};

export { emitCallForHelp, validateBreak };
