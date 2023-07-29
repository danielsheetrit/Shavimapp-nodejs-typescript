import { Request, Response } from 'express';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';
import { User } from '../models/user.model';

const emitCallForHelp = async (req: Request, res: Response) => {
  const { id, name, needHelp } = req.body;

  try {
    await User.findOneAndUpdate({ _id: id }, { need_help: needHelp });

    socketIo.emit(eventEmiters.CALL_FOR_HELP, {
      userId: id,
      name,
      isActive: needHelp,
    });

    return res.json({});
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to emitCallForHelp', error: err });
  }
};

const getAdminDashboard = async (req: Request, res: Response) => {
  const milisec = parseInt(req.params.milisec, 10);
  const workGroup = parseInt(req.params.workGroup, 10);
  const date = new Date(milisec);
  const tommarowDate = new Date(new Date(date).setDate(date.getDate() + 1));

  console.log('milisec', milisec);
  console.log('date', date);
  console.log('tommarowDate', tommarowDate);

  try {
    const users = await User.aggregate([
      {
        $match: {
          user_type: 'user',
          work_group: workGroup,
        },
      },
      {
        $lookup: {
          from: 'clicks',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $eq: ['$date', date] },
                  ],
                },
              },
            },
            { $project: { clicks_dates_length: { $size: '$clicks_dates' } } },
          ],
          as: 'clicks',
        },
      },
      {
        $lookup: {
          from: 'breaks',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $eq: ['$date', date] },
                  ],
                },
              },
            },
            { $project: { breaks_count: 1 } },
          ],
          as: 'breaks',
        },
      },
      {
        $lookup: {
          from: 'distresses',
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $eq: ['$date', date] },
                  ],
                },
              },
            },
            { $project: { distress_count: 1, prev_distress_count: 1 } },
          ],
          as: 'distresses',
        },
      },
      {
        $lookup: {
          from: 'questions',
          let: { userId: '$_id', today: date, tommarowDate },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$receiver', '$$userId'] },
                    { $gte: ['$createdAt', '$$today'] },
                    { $lt: ['$createdAt', '$$tommarowDate'] },
                    { $ne: ['$answer', ''] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
            { $project: { answer: 1 } },
          ],
          as: 'latest_answer',
        },
      },
      {
        $project: {
          _id: 1,
          first_name: 1,
          last_name: 1,
          avatar: 1,
          last_login: 1,
          onBreak: 1,
          connected: 1,
          need_help: 1,
          clicks_count: { $arrayElemAt: ['$clicks.clicks_dates_length', 0] },
          breaks_count: { $arrayElemAt: ['$breaks.breaks_count', 0] },
          prev_distress_count: {
            $arrayElemAt: ['$distresses.prev_distress_count', 0],
          },
          distress_count: {
            $arrayElemAt: ['$distresses.distress_count', 0],
          },
          latest_answer: { $arrayElemAt: ['$latest_answer.answer', 0] },
        },
      },
    ]);

    console.log(JSON.parse(JSON.stringify(users)));

    return res.json(users);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to getAdminDashboard', error: err });
  }
};

const getManagementDashboard = async (req: Request, res: Response) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          created_at: 0,
          password: 0,
        },
      },
    ]);

    res.json(users);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to getManagementDashboard', error: err });
  }
};

export { emitCallForHelp, getAdminDashboard, getManagementDashboard };
