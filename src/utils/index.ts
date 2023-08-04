import { IUser } from '../interfaces/IUser';
import { DateTime } from 'luxon';

const isEmpty = (props: string[]) => {
  return props.some((prop) => !prop || !prop.trim().length);
};

const formatUser = (user: IUser) => {
  const base64Data = user.avatar.toString('base64');
  const formattedUser = JSON.parse(JSON.stringify(user));
  return { ...formattedUser, avatar: base64Data };
};

const getStartAndEndOfDate = (milli: string | number, timzone: string) => {
  const ms = typeof milli === 'string' ? parseInt(milli, 10) : milli;

  const time = DateTime.fromMillis(ms).setZone(timzone);

  const start = time.startOf('day').toJSDate();
  const end = time.endOf('day').toJSDate();

  return { start, end };
};

const getCurrentDate = () => {
  const now = DateTime.utc().toJSDate();
  return now;
};

export { isEmpty, formatUser, getStartAndEndOfDate, getCurrentDate };
