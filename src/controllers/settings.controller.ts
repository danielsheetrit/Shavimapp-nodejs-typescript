import { Request, Response } from 'express';
import { Settings } from '../models/settings.model';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';

const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await Settings.findOne({});
    return res.json(settings);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to getSettings', error: err });
  }
};

const updateSettings = async (req: Request, res: Response) => {
  const { settings } = req.body;
  try {
    // logic to fire samplingCycle change event.
    const currentSettings = await Settings.findOne({});

    if (
      currentSettings?.sampling_cycle_in_minutes !==
        settings.sampling_cycle_in_minutes ||
      currentSettings?.count_ref_per_hour !== settings.count_ref_per_hour
    ) {
      socketIo.emit(eventEmiters.DISTRESS_SETTINGS_CHANGED);
    }

    await Settings.findOneAndUpdate(
      {},
      {
        ...settings,
      }
    );

    socketIo.emit(eventEmiters.SETTINGS_UPDATED);
    return res.json({});
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to updateSettings', error: err });
  }
};

export { getSettings, updateSettings };
