import { Request, Response } from 'express';
import { Event } from '../models/event.model';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';

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

const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find({});

    res.json({ events });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to get event by language', error: err });
  }
};

const updateEventsByLanguage = async (req: Request, res: Response) => {
  const { event } = req.body;

  try {
    const doc = await Event.findOneAndUpdate(
      { language: event.language },
      {
        event_list: event.event_list,
      },
      {
        new: true,
      }
    );
    socketIo.emit(eventEmiters.EVENTS_UPDATED);
    return res.json({ newEvent: doc });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to updateEventsByLanguage', error: err });
  }
};

export { getEventByLanguage, getEvents, updateEventsByLanguage };
