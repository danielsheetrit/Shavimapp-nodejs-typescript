import { Schema, mongoose } from '../db/mongoose';
import { IQuestion, IQuestionDocument } from '../interfaces/IQuestion';

const questionSchema: Schema<IQuestion> = new mongoose.Schema({
  sender: {
    type: Schema.Types.Mixed,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isSystem: {
    type: Boolean,
    required: true,
  },
  question_type: {
    type: String,
    enum: ['video', 'postcard', 'feeling'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  answer: {
    type: String,
  },
  url: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: false,
  },
});

export const Question = mongoose.model<IQuestionDocument>(
  'Question',
  questionSchema
);
