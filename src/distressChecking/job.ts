import schedual from 'node-schedule';
import {
  checkConnected,
  getDistressCheckSettings,
} from '../controllers/utils.controller';
import { socketIo } from '../server';
import { eventEmiters } from '../socketHandlers/eventNames';

let distressInterval: schedual.Job | null = null;
let inProgress = false;
const shutdownTime = 15; // minutes

const startJob = async () => {
  const fireJob = async () => {
    console.log('@ Starting distress job');

    const settings = await getDistressCheckSettings();

    if (!settings) {
      throw new Error('failed to fetch settings when start a job');
    }

    const { sampling_cycle_in_minutes } = settings;

    // 0 */${samplingCycle} * * * * cron expression. runs every X minutes.
    distressInterval = schedual.scheduleJob(
      `0 */${sampling_cycle_in_minutes} * * * *`,
      () => {
        console.log('[Start Distress Check]', Date.now());
        socketIo.emit(eventEmiters.NEED_DISTRESS_JOB_ARGS);
      }
    );

    inProgress = false;
  };

  if (!distressInterval && !inProgress) {
    inProgress = true;
    fireJob();
  }
};

const stopJobAfterStale = () => {
  setTimeout(async () => {
    const isConnected = await checkConnected();

    if (distressInterval && !isConnected) {
      console.log('@ Canceling distress interval');
      distressInterval.cancel();
      distressInterval = null;
    }
  }, shutdownTime * 60 * 1000);
};

const restartJob = () => {
  if (distressInterval) {
    console.log('@ Restarting cycle due sampling change');
    distressInterval.cancel();
    distressInterval = null;
    startJob();
  }
};

export { distressInterval, startJob, stopJobAfterStale, restartJob };
