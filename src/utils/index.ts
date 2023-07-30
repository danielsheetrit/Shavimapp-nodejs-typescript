import { IUser } from '../interfaces/IUser';
import moment, { Moment } from 'moment-timezone';

const isEmpty = (props: string[]) => {
  return props.some((prop) => !prop || !prop.trim().length);
};

const formatUser = (user: IUser) => {
  const base64Data = user.avatar.toString('base64');
  const formattedUser = JSON.parse(JSON.stringify(user));
  return { ...formattedUser, avatar: base64Data };
};

const getStartAndEndOfDate = (
  milli: number | string,
  offsetMinutes: number
) => {
  let date: number | string | Moment = milli;

  if (typeof milli === 'string') {
    date = moment(parseInt(milli, 10));
  }

  // Parse the date and adjust it for the timezone offset
  const utcDate = moment(date).add(offsetMinutes, 'minutes');

  // Get the start and end of the day in UTC
  const start = utcDate.clone().startOf('day').toDate();
  const end = utcDate.clone().endOf('day').toDate();

  return { start, end };
};

const getCurrentDate = () => {
  const utcMoment = moment.utc();
  const utcDate = new Date(utcMoment.format());
  return utcDate;
};

export { isEmpty, formatUser, getStartAndEndOfDate, getCurrentDate };
