import { Distress } from '../models/distress.model';
import { User } from '../models/user.model';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';
import { createQuestion } from '../controllers/utils.controller';

const distressCheck = async (
  sampling_cycle_in_minutes: number,
  count_ref_per_hour: number
) => {
  // Get the start and end of today
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const users = await User.aggregate([
    {
      $match: {
        connected: true,
        onBreak: false,
        user_type: 'user',
        // last_login: {
        //   $gte: new Date(
        //     currentTime - percentOfTheSample * samplingInMilliSeconds
        //   ),
        // },
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
                  { $eq: ['$date', startOfToday] },
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
        from: 'distresses',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  { $eq: ['$date', startOfToday] },
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
        clicks_count: { $arrayElemAt: ['$clicks.clicks_dates_length', 0] },
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

  const expectedClicksPerCycle = Math.round(
    (count_ref_per_hour * sampling_cycle_in_minutes) / 60
  );

  validUsersForCheck.forEach(async (user) => {
    const UserPervDistressSampleCount = user.prev_clicks_sample || 0;

    const diff = user.clicks_count - UserPervDistressSampleCount;

    const isDistress =
      diff < expectedClicksPerCycle - expectedClicksPerCycle * 0.3;

    const distressRecord = await Distress.findOne({
      userId: user._id,
      date: startOfToday,
    });

    if (distressRecord) {
      // must placed before re-assign distress_count
      distressRecord.prev_distress_count = distressRecord.distress_count;

      distressRecord.distress_count = isDistress
        ? distressRecord.distress_count + 1
        : distressRecord.distress_count;

      distressRecord.prev_clicks_sample = user.clicks_count;

      await distressRecord.save();
    } else {
      const newUserDistress = new Distress({
        userId: user._id,
        distress_count: isDistress ? 1 : 0,
        prev_distress_count: 0,
        prev_clicks_sample: user.clicks_count,
        date: startOfToday,
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
