import { mongoose, Schema } from '../db/mongoose';
import { IUser, IUserDocument } from '../interfaces/IUser';

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, 'Password must include at least 8 characters.'],
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  user_type: {
    type: String,
    required: true,
    enum: ['user', 'admin', 'chief'],
    default: 'user',
  },
  created_at: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  language: {
    type: String,
    lowercase: true,
    enum: ['en', 'ru', 'he', 'ar'],
    default: 'he',
  },
  work_group: {
    type: Number,
    required: true,
    default: 1,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  avatar: {
    type: Buffer,
    default: '',
  },
  connected: {
    type: Boolean,
    default: false,
  },
  onBreak: {
    type: Boolean,
    default: false,
  },
  need_help: {
    type: Boolean,
    default: false,
  },
  last_login: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
});

const User = mongoose.model<IUserDocument>('User', userSchema);

export { User };
