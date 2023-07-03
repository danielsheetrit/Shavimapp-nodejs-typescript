import { IQuestion } from '../interfaces/IQuestion';
import { Question } from '../models/question.model';
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

const createQuestion = async (questionBody: any) => {
  const { isSystem, sender, receiver, question_type, url, text } = questionBody;

  const newQuestion = {
    isSystem,
    sender,
    receiver,
    question_type,
    url,
    text,
    createdAt: new Date(),
    answer: '',
  };

  const doc: IQuestion = await new Question(newQuestion).save();
  return doc;
};

export { checkConnected, getDistressCheckSettings, createQuestion };
