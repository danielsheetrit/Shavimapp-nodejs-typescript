import { Request, Response } from 'express';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';
import { User } from '../models/user.model';
import { getStartAndEndOfDate } from '../utils';

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
  const { milli, offset, workGroup } = req.params;

  const parsedOffest = parseInt(offset, 10);
  const parsedWorkGroup = parseInt(workGroup, 10);

  const { start, end } = getStartAndEndOfDate(milli, parsedOffest);

  try {
    const users = await User.aggregate([
      {
        $match: {
          user_type: 'user',
          work_group: parsedWorkGroup,
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
                    { $eq: ['$user_id', '$$userId'] },
                    { $gt: ['$created_at', start] },
                    { $lt: ['$created_at', end] },
                  ],
                },
              },
            },
            { $project: { count: 1 } },
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
                    { $eq: ['$user_id', '$$userId'] },
                    { $gt: ['$created_at', start] },
                    { $lt: ['$created_at', end] },
                  ],
                },
              },
            },
            { $project: { count: 1 } },
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
                    { $eq: ['$user_id', '$$userId'] },
                    { $gt: ['$created_at', start] },
                    { $lt: ['$created_at', end] },
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
          let: { userId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$receiver', '$$userId'] },
                    { $gt: ['$created_at', start] },
                    { $lt: ['$created_at', end] },
                    { $ne: ['$answer', ''] },
                  ],
                },
              },
            },
            { $sort: { created_at: -1 } },
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
          clicks_count: { $arrayElemAt: ['$clicks.count', 0] },
          breaks_count: { $arrayElemAt: ['$breaks.count', 0] },
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
