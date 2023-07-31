import { Distress } from '../models/distress.model';
import { User } from '../models/user.model';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';
import { createQuestion } from '../controllers/utils.controller';
import { getCurrentDate, getStartAndEndOfDate } from '../utils';
import { mongoose } from '../db/mongoose';

const distressCheck = async (
  sampling_cycle_in_minutes: number,
  count_ref_per_hour: number,
  offset: number,
  milli: number
) => {
  const { start, end } = getStartAndEndOfDate(milli, offset);

  const users = await User.aggregate([
    {
      $match: {
        connected: true,
        onBreak: false,
        user_type: 'user',
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
          { $project: { prev_clicks_sample: 1 } },
        ],
        as: 'distresses',
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        clicks_count: { $arrayElemAt: ['$clicks.count', 0] },
        prev_clicks_sample: {
          $arrayElemAt: ['$distresses.prev_clicks_sample', 0],
        },
      },
    },
  ]);

  if (users.length === 0) {
    console.log('No users availble for check');
    return;
  }

  const validUsersForCheck = users.filter((user) => user.clicks_count);

  if (validUsersForCheck.length === 0) {
    console.log('No users with clicks count available');
    return;
  }

  _actualCheck(
    count_ref_per_hour,
    sampling_cycle_in_minutes,
    validUsersForCheck,
    start,
    end
  );
};

type UsersToCheckType = {
  _id: string;
  username: string;
  clicks_count: number;
  prev_clicks_sample: number;
};

const _actualCheck = async (
  sampling_cycle_in_minutes: number,
  count_ref_per_hour: number,
  validUsersForCheck: UsersToCheckType[],
  startOfDay: Date,
  endOfDay: Date
) => {
  const expectedClicksPerCycle = Math.round(
    (count_ref_per_hour * sampling_cycle_in_minutes) / 60
  );

  await validUsersForCheck.forEach(async (user) => {
    const UserPervDistressSampleCount = user.prev_clicks_sample || 0;

    const diff = user.clicks_count - UserPervDistressSampleCount;

    const isDistress =
      diff < expectedClicksPerCycle - expectedClicksPerCycle * 0.3;

    const distressRecords = await Distress.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(user._id), // check
          created_at: { $gt: startOfDay, $lt: endOfDay },
        },
      },
    ]);

    const distressRecord = distressRecords[0] || null;

    if (distressRecord) {
      const { distress_count } = distressRecord;

      await Distress.findOneAndUpdate(
        { _id: distressRecord._id },
        {
          prev_distress_count: distress_count,
          distress_count: isDistress ? distress_count + 1 : distress_count,
          prev_clicks_sample: user.clicks_count,
        }
      );
    } else {
      const newUserDistress = new Distress({
        user_id: user._id,
        distress_count: isDistress ? 1 : 0,
        prev_distress_count: 0,
        prev_clicks_sample: user.clicks_count,
        created_at: getCurrentDate(),
      });
      await newUserDistress.save();
    }

    if (isDistress) {
      socketIo.emit(eventEmiters.USER_IN_DISTRESS, { userId: user._id });

      const feelingQuestion = await createQuestion({
        isSystem: true,
        sender: null,
        receiver: user._id,
        question_type: 'feeling',
        url: '',
        text: '',
      });

      socketIo.emit(eventEmiters.QUESTION_CREATED, {
        question: feelingQuestion,
      });
    }
  });

  console.log('[Finished Distress Check]', Date.now());
};

export { distressCheck };
