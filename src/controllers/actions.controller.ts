import { Request, Response } from 'express';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';

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

export { emitCallForHelp };
