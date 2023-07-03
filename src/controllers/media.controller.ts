import { Request, Response } from 'express';
import { Media } from '../models/media.model';

const getAllMedia = async (req: Request, res: Response) => {
  try {
    const media = await Media.find({});
    return res.json(media);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to getSettings', error: err });
  }
};

export { getAllMedia };
