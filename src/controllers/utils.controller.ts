import { Settings } from '../models/settings.model';
import { User } from '../models/user.model';

const checkConnected = async () => {
  try {
    const usersArr = await User.find({ connected: true, user_type: 'user' });
    return usersArr.length > 0;
  } catch (error) {
    console.error(error);
  }
};

const getDistressCheckSettings = async () => {
  try {
    const settings = await Settings.findOne({});
    return settings;
  } catch (error) {
    console.error('failed to get sampling cycle variable', error);
  }
};

export { checkConnected, getDistressCheckSettings };
