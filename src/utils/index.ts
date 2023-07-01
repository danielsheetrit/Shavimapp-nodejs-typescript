import { IUser } from '../interfaces/IUser';

const isEmpty = (props: string[]) => {
  return props.some((prop) => !prop || !prop.trim().length);
};

const formatUser = (user: IUser) => {
  const base64Data = user.avatar.toString('base64');
  const formattedUser = JSON.parse(JSON.stringify(user));
  return { ...formattedUser, avatar: base64Data };
};

export { isEmpty, formatUser };
