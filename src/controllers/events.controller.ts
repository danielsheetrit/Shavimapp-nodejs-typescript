import { Request, Response } from 'express';
import { Event } from '../models/event.model';

const getEventByLanguage = async (req: Request, res: Response) => {
  const { language } = req.params;

  try {
    const event = await Event.findOne({ language });

    res.json({ event });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to get event by language', error: err });
  }
};

export { getEventByLanguage };
